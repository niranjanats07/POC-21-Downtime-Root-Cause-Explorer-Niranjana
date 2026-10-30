
"use client";

import { useEffect, useMemo, useState } from "react";

import ParetoChart from "./components/ParetoChart";
import ScatterChart from "./components/ScatterChart";
import RootCauseTree from "./components/RootCauseTree";
import IntelligencePanel from "./components/IntelligencePanel";

type Incident = {
  incident_id: string;
  machine_id: string;
  incident_date: string;
  shift: string;
  root_cause: string;
  sub_cause: string;
  downtime_minutes: number;
  failure_frequency: number;
  severity: string;
  status: string;
  description: string;
};

const API = "http://localhost:8000";

const emptyFilters = {
  machine_id: "",
  shift: "",
  severity: "",
  root_cause: "",
  status: "",
};

const technologyStack =
  "React · Next.js · TypeScript · Tailwind CSS · FastAPI · Pandas · DuckDB · Apache ECharts · Plotly · D3.js";

export default function Home() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] =
    useState<Incident | null>(null);

  const [filters, setFilters] = useState(emptyFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showMetadata, setShowMetadata] = useState(false);

  useEffect(() => {
    async function loadIncidents() {
      try {
        const response = await fetch(`${API}/api/incidents`);

        if (!response.ok) {
          throw new Error("Unable to load incidents.");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid incident data received.");
        }

        setIncidents(data);
      } catch (err) {
        console.error(err);
        setError(
          "Could not load dashboard data. Please check that the backend is running."
        );
      } finally {
        setLoading(false);
      }
    }

    loadIncidents();
  }, []);

  const filteredIncidents = useMemo(() => {
    return incidents.filter((incident) => {
      return (
        (!filters.machine_id ||
          incident.machine_id === filters.machine_id) &&
        (!filters.shift || incident.shift === filters.shift) &&
        (!filters.severity ||
          incident.severity === filters.severity) &&
        (!filters.root_cause ||
          incident.root_cause === filters.root_cause) &&
        (!filters.status || incident.status === filters.status)
      );
    });
  }, [incidents, filters]);

  const totalIncidents = filteredIncidents.length;

  const totalDowntime = filteredIncidents.reduce(
    (sum, item) => sum + Number(item.downtime_minutes || 0),
    0
  );

  const averageDowntime =
    totalIncidents > 0 ? totalDowntime / totalIncidents : 0;

  const closedIncidents = filteredIncidents.filter(
    (item) => item.status === "Closed"
  );

  const closedAverage =
    closedIncidents.length > 0
      ? closedIncidents.reduce(
          (sum, item) =>
            sum + Number(item.downtime_minutes || 0),
          0
        ) / closedIncidents.length
      : 0;

  const causes = useMemo(() => {
    const totals: Record<string, number> = {};

    filteredIncidents.forEach((item) => {
      totals[item.root_cause] =
        (totals[item.root_cause] || 0) +
        Number(item.downtime_minutes || 0);
    });

    const sorted = Object.entries(totals)
      .map(([root_cause, downtime_minutes]) => ({
        root_cause,
        downtime_minutes,
      }))
      .sort((a, b) => b.downtime_minutes - a.downtime_minutes);

    let cumulative = 0;

    return sorted.map((item) => {
      cumulative += item.downtime_minutes;

      return {
        ...item,
        cumulative_downtime: cumulative,
        cumulative_percentage:
          totalDowntime > 0
            ? Number(
                ((cumulative / totalDowntime) * 100).toFixed(2)
              )
            : 0,
      };
    });
  }, [filteredIncidents, totalDowntime]);

  const machines = useMemo(() => {
    const totals: Record<string, number> = {};

    filteredIncidents.forEach((item) => {
      totals[item.machine_id] =
        (totals[item.machine_id] || 0) +
        Number(item.downtime_minutes || 0);
    });

    return Object.entries(totals)
      .map(([machine_id, downtime_minutes]) => ({
        machine_id,
        downtime_minutes,
      }))
      .sort((a, b) => b.downtime_minutes - a.downtime_minutes);
  }, [filteredIncidents]);

  const heatmap = useMemo(() => {
    const result: Record<string, Record<string, number>> = {};

    filteredIncidents.forEach((item) => {
      if (!result[item.machine_id]) {
        result[item.machine_id] = {
          Morning: 0,
          Evening: 0,
          Night: 0,
        };
      }

      if (item.shift in result[item.machine_id]) {
        result[item.machine_id][item.shift] +=
          Number(item.downtime_minutes || 0);
      }
    });

    return Object.entries(result).map(([machine_id, shifts]) => ({
      machine_id,
      Morning: shifts.Morning,
      Evening: shifts.Evening,
      Night: shifts.Night,
    }));
  }, [filteredIncidents]);

  const rootCauses = useMemo(() => {
    const totals: Record<string, number> = {};

    filteredIncidents.forEach((item) => {
      const key = `${item.root_cause}|||${item.sub_cause}`;
      totals[key] =
        (totals[key] || 0) +
        Number(item.downtime_minutes || 0);
    });

    return Object.entries(totals).map(([key, downtime_minutes]) => {
      const [root_cause, sub_cause] = key.split("|||");

      return { root_cause, sub_cause, downtime_minutes };
    });
  }, [filteredIncidents]);

  const updateFilter = (
    name: keyof typeof emptyFilters,
    value: string
  ) => {
    setFilters((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetFilters = () => {
    setFilters(emptyFilters);
  };

  // Opens the Intelligence Panel for the machine selected.
  // The incident with the highest downtime is selected.
  const handleMachineClick = (machineId: string) => {
    const machineIncidents = filteredIncidents
      .filter((incident) => incident.machine_id === machineId)
      .sort(
        (a, b) =>
          Number(b.downtime_minutes) -
          Number(a.downtime_minutes)
      );

    if (machineIncidents.length > 0) {
      setSelectedIncident(machineIncidents[0]);
    }
  };

  const exportData = (format: "csv" | "json") => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });

    const query = params.toString();
    const url =
      `${API}/api/incidents/export/${format}` +
      (query ? `?${query}` : "");

    window.open(url, "_blank");
  };

  const filterOptions = {
    machine_id: [
      ...new Set(incidents.map((item) => item.machine_id)),
    ],
    shift: [...new Set(incidents.map((item) => item.shift))],
    severity: [
      ...new Set(incidents.map((item) => item.severity)),
    ],
    root_cause: [
      ...new Set(incidents.map((item) => item.root_cause)),
    ],
    status: [...new Set(incidents.map((item) => item.status))],
  };

  return (
    <main className="min-h-screen bg-[#070d18] p-4 text-white md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Dashboard Header */}
        <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
              Infocreon Internship · PoC 21
            </p>

            <h1 className="text-3xl font-bold md:text-4xl">
              Downtime Root Cause Explorer
            </h1>

            <p className="mt-3 text-sm text-slate-400">
              Machinery and asset utilization intelligence dashboard
            </p>

            <p className="mt-2 text-xs text-amber-400">
              Demonstration dashboard · Synthetic downtime data
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowMetadata(true)}
            aria-label="Open project information"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-600 text-lg font-semibold text-cyan-300 transition hover:border-cyan-400 hover:bg-cyan-400/10"
          >
            i
          </button>
        </header>

        {/* Project Information Modal */}
        {showMetadata && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 p-4"
            onClick={() => setShowMetadata(false)}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-information-title"
              className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-slate-700 bg-[#101b2b] p-6 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
                    Infocreon Internship
                  </p>

                  <h2
                    id="project-information-title"
                    className="mt-2 text-2xl font-bold"
                  >
                    Project Information
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setShowMetadata(false)}
                  aria-label="Close project information"
                  className="rounded-lg border border-slate-600 px-3 py-2 text-slate-300 transition hover:bg-slate-700"
                >
                  ×
                </button>
              </div>

              <div className="space-y-5">
                <div className="border-b border-slate-700 pb-4">
                  <p className="text-sm text-slate-400">Developer</p>
                  <p className="mt-1 font-semibold text-white">
                    Niranjana T suresh
                  </p>
                </div>

                <div className="border-b border-slate-700 pb-4">
                  <p className="text-sm text-slate-400">PoC ID</p>
                  <p className="mt-1 font-semibold text-white">21</p>
                </div>

                <div className="border-b border-slate-700 pb-4">
                  <p className="text-sm text-slate-400">Batch</p>
                  <p className="mt-1 font-semibold text-white">
                    Batch8/MA College
                  </p>
                </div>

                <div className="border-b border-slate-700 pb-4">
                  <p className="text-sm text-slate-400">
                    Technology Stack
                  </p>
                  <p className="mt-2 text-sm leading-7 text-white">
                    {technologyStack}
                  </p>
                </div>

                <div className="border-b border-slate-700 pb-4">
                  <p className="text-sm text-slate-400">GitHub</p>
                  <a
                    href="https://github.com/niranjanats07"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block font-semibold text-cyan-300 underline decoration-cyan-500/40 underline-offset-4 hover:text-cyan-200"
                  >
                    @niranjanats07
                  </a>
                </div>

                <div>
                  <p className="text-sm text-slate-400">Program</p>
                  <p className="mt-1 font-semibold text-white">
                    Infocreon Internship
                  </p>
                </div>
              </div>

              <div className="mt-7 border-t border-slate-700 pt-4 text-xs text-slate-500">
                Downtime Root Cause Explorer · PoC 21
              </div>
            </section>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <p className="py-10 text-slate-400">
            Loading dashboard data...
          </p>
        ) : (
          <>
            {/* Filters */}
            <section className="mb-8 rounded-xl border border-slate-800 bg-slate-900 p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">
                    Incident Filters
                  </h2>
                  <p className="mt-1 text-xs text-slate-400">
                    Filters update the KPIs, charts and incident list.
                  </p>
                </div>

                <button
                  onClick={resetFilters}
                  className="rounded-lg border border-slate-600 px-4 py-2 text-sm hover:bg-slate-800"
                >
                  Reset filters
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {(
                  [
                    ["machine_id", "Machine"],
                    ["shift", "Shift"],
                    ["severity", "Severity"],
                    ["root_cause", "Root cause"],
                    ["status", "Status"],
                  ] as const
                ).map(([key, label]) => (
                  <label key={key} className="text-sm text-slate-300">
                    {label}
                    <select
                      value={filters[key]}
                      onChange={(event) =>
                        updateFilter(key, event.target.value)
                      }
                      className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white"
                    >
                      <option value="">All</option>
                      {filterOptions[key].map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={() => exportData("csv")}
                  className="rounded-lg bg-cyan-700 px-4 py-2 text-sm font-semibold hover:bg-cyan-600"
                >
                  Download CSV
                </button>

                <button
                  onClick={() => exportData("json")}
                  className="rounded-lg bg-indigo-700 px-4 py-2 text-sm font-semibold hover:bg-indigo-600"
                >
                  Download JSON
                </button>

                <span className="self-center text-xs text-slate-400">
                  {filteredIncidents.length} of {incidents.length} incidents
                </span>
              </div>
            </section>

            {/* KPI Cards */}
            <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Total Incidents", totalIncidents, "incidents"],
                ["Total Downtime", totalDowntime, "minutes"],
                [
                  "Average Downtime",
                  averageDowntime.toFixed(1),
                  "minutes",
                ],
                [
                  "Closed Incident Average",
                  closedAverage.toFixed(1),
                  "minutes",
                ],
              ].map(([label, value, unit]) => (
                <div
                  key={String(label)}
                  className="rounded-xl border border-slate-800 bg-slate-900 p-5"
                >
                  <p className="text-sm text-slate-400">{label}</p>
                  <p className="mt-3 text-3xl font-bold text-cyan-300">
                    {value}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{unit}</p>
                </div>
              ))}
            </section>

            {filteredIncidents.length === 0 ? (
              <div className="mb-8 rounded-xl border border-amber-500/30 bg-amber-500/10 p-6 text-amber-200">
                No incidents match the selected filters. Try resetting or
                changing your filters.
              </div>
            ) : (
              <>
                {/* Pareto and Machine Downtime */}
                <section className="mb-8 grid gap-6 lg:grid-cols-2">
                  <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                    <h2 className="mb-2 text-lg font-semibold">
                      Downtime Pareto Analysis
                    </h2>
                    <p className="mb-4 text-sm text-slate-400">
                      Downtime contribution by root cause.
                    </p>
                    <ParetoChart data={causes} />
                  </div>

                  {/* Clickable Machine Downtime */}
                  <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                    <h2 className="mb-2 text-lg font-semibold">
                      Downtime by Machine
                    </h2>

                    <p className="mb-5 text-xs text-slate-400">
                      Click any machine bar to investigate its highest-downtime incident.
                    </p>

                    <div className="space-y-5">
                      {machines.map((machine) => (
                        <button
                          key={machine.machine_id}
                          type="button"
                          onClick={() =>
                            handleMachineClick(machine.machine_id)
                          }
                          aria-label={`Investigate ${machine.machine_id}, ${machine.downtime_minutes} minutes downtime`}
                          className="group block w-full rounded-lg p-2 text-left transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        >
                          <div className="mb-2 flex justify-between text-sm">
                            <span className="font-medium text-white group-hover:text-cyan-300">
                              {machine.machine_id}
                            </span>

                            <span className="text-slate-400">
                              {machine.downtime_minutes} min
                            </span>
                          </div>

                          <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                            <div
                              className="h-full rounded-full bg-indigo-400 transition-all duration-300 group-hover:bg-cyan-400"
                              style={{
                                width: `${
                                  totalDowntime > 0
                                    ? (machine.downtime_minutes /
                                        totalDowntime) *
                                      100
                                    : 0
                                }%`,
                              }}
                            />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Scatter Chart */}
                <section className="mb-8 rounded-xl border border-slate-800 bg-slate-900 p-5">
                  <h2 className="mb-2 text-lg font-semibold">
                    Failure Frequency vs Downtime Duration
                  </h2>
                  <p className="mb-4 text-sm text-slate-400">
                    Compare recorded failure frequency with downtime.
                  </p>
                  <ScatterChart data={filteredIncidents} />
                </section>

                {/* Root Cause Tree */}
                <section className="mb-8 rounded-xl border border-slate-800 bg-slate-900 p-5">
                  <h2 className="mb-2 text-lg font-semibold">
                    Root Cause Tree
                  </h2>
                  <p className="mb-4 text-sm text-slate-400">
                    Main causes and their contributing sub-causes.
                  </p>
                  <RootCauseTree data={rootCauses} />
                </section>

                {/* Machine Shift Heatmap */}
                <section className="mb-8 rounded-xl border border-slate-800 bg-slate-900 p-5">
                  <h2 className="mb-2 text-lg font-semibold">
                    Machine / Shift Downtime Heatmap
                  </h2>
                  <p className="mb-4 text-sm text-slate-400">
                    Downtime minutes by machine and shift.
                  </p>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[500px] text-left text-sm">
                      <thead>
                        <tr className="border-b border-slate-700 text-slate-400">
                          <th className="p-3">Machine</th>
                          <th className="p-3">Morning</th>
                          <th className="p-3">Evening</th>
                          <th className="p-3">Night</th>
                        </tr>
                      </thead>

                      <tbody>
                        {heatmap.map((row) => (
                          <tr
                            key={row.machine_id}
                            className="border-b border-slate-800"
                          >
                            <td className="p-3 font-medium">
                              {row.machine_id}
                            </td>
                            {[row.Morning, row.Evening, row.Night].map(
                              (value, index) => (
                                <td className="p-3" key={index}>
                                  <span className="inline-block min-w-14 rounded-md bg-cyan-500/20 px-3 py-2 text-center">
                                    {value}
                                  </span>
                                </td>
                              )
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </>
            )}

            {/* Incident Investigation */}
            <section className="mb-8 rounded-xl border border-slate-800 bg-slate-900 p-5">
              <h2 className="text-lg font-semibold">
                Incident Investigation
              </h2>
              <p className="mb-4 mt-2 text-sm text-slate-400">
                Select an incident to view its details.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[750px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-700 text-slate-400">
                      <th className="p-3">Incident</th>
                      <th className="p-3">Machine</th>
                      <th className="p-3">Shift</th>
                      <th className="p-3">Severity</th>
                      <th className="p-3">Frequency</th>
                      <th className="p-3">Downtime</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredIncidents.map((incident) => (
                      <tr
                        key={incident.incident_id}
                        className="border-b border-slate-800 hover:bg-slate-800/50"
                      >
                        <td className="p-3">{incident.incident_id}</td>
                        <td className="p-3">{incident.machine_id}</td>
                        <td className="p-3">{incident.shift}</td>
                        <td className="p-3">{incident.severity}</td>
                        <td className="p-3">
                          {incident.failure_frequency}
                        </td>
                        <td className="p-3">
                          {incident.downtime_minutes} min
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => setSelectedIncident(incident)}
                            className="rounded-lg border border-teal-500/40 bg-teal-500/10 px-3 py-2 text-xs font-semibold text-teal-300 hover:bg-teal-500/20"
                          >
                            Investigate
                          </button>
                        </td>
                      </tr>
                    ))}

                    {filteredIncidents.length === 0 && (
                      <tr>
                        <td
                          colSpan={7}
                          className="p-5 text-center text-slate-400"
                        >
                          No incident records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {/* Developer Signature */}
        <footer className="mt-10 border-t border-slate-800 pt-5 text-xs leading-6 text-slate-500">
          <p>Developed by: Niranjana T suresh</p>
          <p>PoC ID: 21</p>
          <p>Batch: Batch8/MA College</p>
          <p>GitHub: @niranjanats07</p>
          <p>Infocreon Internship</p>
          <p className="mt-2">
            Downtime Root Cause Explorer · Synthetic demonstration data
          </p>
        </footer>
      </div>

      {/* Intelligence Slide-over Panel */}
      <IntelligencePanel
        incident={selectedIncident}
        onClose={() => setSelectedIncident(null)}
      />
    </main>
  );
}
