
"use client";

import ReactECharts from "echarts-for-react";

type Incident = {
  incident_id: string;
  machine_id: string;
  failure_frequency: number;
  downtime_minutes: number;
};

type Props = {
  data: Incident[];
};

export default function ScatterChart({ data }: Props) {
  const option = {
    tooltip: {
      trigger: "item",
      formatter: (params: any) => {
        const item = params.data;
        return `
          <b>${item[2]}</b><br/>
          Machine: ${item[3]}<br/>
          Failure Frequency: ${item[0]}<br/>
          Downtime: ${item[1]} minutes
        `;
      },
    },
    grid: {
      left: "8%",
      right: "5%",
      bottom: "15%",
      containLabel: true,
    },
    xAxis: {
      type: "value",
      name: "Failure Frequency",
      nameLocation: "middle",
      nameGap: 35,
      axisLabel: { color: "#cbd5e1" },
      nameTextStyle: { color: "#cbd5e1" },
      splitLine: {
        lineStyle: { color: "#334155" },
      },
    },
    yAxis: {
      type: "value",
      name: "Downtime (minutes)",
      nameLocation: "middle",
      nameGap: 50,
      axisLabel: { color: "#cbd5e1" },
      nameTextStyle: { color: "#cbd5e1" },
      splitLine: {
        lineStyle: { color: "#334155" },
      },
    },
    series: [
      {
        name: "Downtime Incidents",
        type: "scatter",
        symbolSize: 16,
        data: data.map((item) => [
          Number(item.failure_frequency),
          Number(item.downtime_minutes),
          item.incident_id,
          item.machine_id,
        ]),
        itemStyle: {
          color: "#a78bfa",
          borderColor: "#c4b5fd",
          borderWidth: 1,
        },
      },
    ],
  };

  return (
    <ReactECharts
      option={option}
      style={{ height: "350px", width: "100%" }}
      notMerge={true}
      lazyUpdate={true}
    />
  );
}
