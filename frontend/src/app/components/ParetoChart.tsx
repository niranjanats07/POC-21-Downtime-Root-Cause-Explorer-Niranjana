
"use client";

import ReactECharts from "echarts-for-react";

type Cause = {
  root_cause: string;
  downtime_minutes: number;
  cumulative_percentage: number;
};

type Props = {
  data: Cause[];
};

export default function ParetoChart({ data }: Props) {
  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    legend: {
      data: ["Downtime", "Cumulative Percentage"],
      textStyle: {
        color: "#cbd5e1",
      },
    },
    grid: {
      left: "5%",
      right: "8%",
      bottom: "12%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: data.map((item) => item.root_cause),
      axisLabel: {
        color: "#cbd5e1",
        rotate: 15,
      },
    },
    yAxis: [
      {
        type: "value",
        name: "Downtime (minutes)",
        axisLabel: {
          color: "#cbd5e1",
        },
        splitLine: {
          lineStyle: {
            color: "#334155",
          },
        },
      },
      {
        type: "value",
        name: "Cumulative (%)",
        min: 0,
        max: 100,
        axisLabel: {
          color: "#cbd5e1",
          formatter: "{value}%",
        },
      },
    ],
    series: [
      {
        name: "Downtime",
        type: "bar",
        data: data.map((item) => item.downtime_minutes),
        itemStyle: {
          color: "#22d3ee",
          borderRadius: [5, 5, 0, 0],
        },
        barWidth: "45%",
      },
      {
        name: "Cumulative Percentage",
        type: "line",
        yAxisIndex: 1,
        data: data.map((item) => item.cumulative_percentage),
        smooth: true,
        symbolSize: 8,
        lineStyle: {
          width: 3,
          color: "#f59e0b",
        },
        itemStyle: {
          color: "#f59e0b",
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
