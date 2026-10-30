
"use client";

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

type Props = {
  incident: Incident | null;
  onClose: () => void;
};

export default function IntelligencePanel({
  incident,
  onClose,
}: Props) {
  if (!incident) return null;

  const recommendations: Record<string, string> = {
    Mechanical:
      "Review mechanical wear, lubrication, bearings and preventive maintenance intervals.",
    Electrical:
      "Inspect electrical connections, motors, sensors and power supply stability.",
    Operational:
      "Review machine operating procedures, material flow and operator training.",
    Maintenance:
      "Review preventive maintenance scheduling and overdue maintenance tasks.",
  };

  const recommendation =
    recommendations[incident.root_cause] ??
    "Conduct a detailed engineering investigation to identify the underlying failure mechanism.";

  const priority =
    incident.severity.toLowerCase() === "high"
      ? "High"
      : incident.severity.toLowerCase() === "medium"
      ? "Medium"
      : "Low";

  return (
    <div className="fixed inset-0 z-50">
      <button
        aria-label="Close investigation panel"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="investigation-title"
        className="custom-scrollbar absolute right-0 top-0 h-full w-full max-w-xl overflow-y-auto border-l border-slate-700 bg-[#0c1722] p-6 text-white shadow-2xl sm:p-8"
      >
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-400">
              Operations Intelligence
            </p>

            <h2
              id="investigation-title"
              className="mt-2 text-2xl font-bold"
            >
              Incident Investigation
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              {incident.incident_id}
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close panel"
            className="rounded-lg border border-slate-600 px-4 py-2 hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        <section className="dashboard-panel mb-6 p-5">
          <p className="text-sm text-slate-400">
            Total downtime
          </p>

          <p className="mt-2 text-4xl font-bold text-teal-400">
            {incident.downtime_minutes}
            <span className="ml-2 text-sm font-normal text-slate-400">
              minutes
            </span>
          </p>
        </section>

        <section className="mb-6">
          <h3 className="mb-4 text-lg font-semibold">
            Incident details
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {[
              ["Machine", incident.machine_id],
              ["Date", incident.incident_date],
              ["Shift", incident.shift],
              ["Frequency", incident.failure_frequency],
              ["Root cause", incident.root_cause],
              ["Sub-cause", incident.sub_cause],
              ["Severity", incident.severity],
              ["Status", incident.status],
            ].map(([label, value]) => (
              <div
                key={String(label)}
                className="rounded-lg border border-slate-700 bg-slate-900 p-4"
              >
                <p className="text-xs text-slate-400">
                  {label}
                </p>

                <p className="mt-2 break-words text-sm font-semibold">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-panel mb-6 p-5">
          <h3 className="mb-3 font-semibold">
            Failure description
          </h3>

          <p className="text-sm leading-7 text-slate-300">
            {incident.description}
          </p>
        </section>

        <section className="dashboard-panel mb-6 p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold">
              Investigation priority
            </h3>

            <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
              {priority}
            </span>
          </div>

          <p className="text-sm leading-7 text-slate-300">
            {incident.severity} severity is recorded for this
            incident. Review its downtime impact, recurrence
            and operational context before prioritizing action.
          </p>
        </section>

        <section className="rounded-xl border border-teal-500/30 bg-teal-500/5 p-5">
          <h3 className="mb-3 font-semibold text-teal-300">
            Management investigation recommendation
          </h3>

          <p className="text-sm leading-7 text-slate-200">
            {recommendation}
          </p>

          <p className="mt-4 border-t border-teal-500/20 pt-4 text-xs leading-6 text-slate-400">
            Decision-support suggestion based on the recorded
            root-cause category. Validate findings with
            maintenance records and engineering personnel.
          </p>
        </section>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-lg bg-teal-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-teal-400"
        >
          Close investigation
        </button>
      </aside>
    </div>
  );
}
