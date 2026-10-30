
"use client";

import ReactECharts from "echarts-for-react";

type RootCause = {
  root_cause: string;
  sub_cause: string;
  downtime_minutes: number;
};

type Props = {
  data: RootCause[];
};

export default function RootCauseTree({ data }: Props) {
  const groupedData = new Map<string, RootCause[]>();

  data.forEach((item) => {
    if (!groupedData.has(item.root_cause)) {
      groupedData.set(item.root_cause, []);
    }

    groupedData.get(item.root_cause)!.push(item);
  });

  const treeData = Array.from(groupedData.entries()).map(
    ([rootCause, subCauses]) => ({
      name: rootCause,
      children: subCauses.map((item) => ({
        name: `${item.sub_cause} (${item.downtime_minutes} min)`,
        value: item.downtime_minutes,
      })),
    })
  );

  const option = {
    tooltip: {
      trigger: "item",
      triggerOn: "mousemove",
    },
    series: [
      {
        type: "tree",
        data: treeData,
        top: "5%",
        left: "12%",
        bottom: "5%",
        right: "25%",
        layout: "orthogonal",
        orient: "LR",
        symbol: "roundRect",
        symbolSize: 10,
        edgeShape: "polyline",
        edgeForkPosition: "50%",
        expandAndCollapse: true,
        initialTreeDepth: -1,
        animationDuration: 500,
        animationDurationUpdate: 750,
        label: {
          position: "left",
          verticalAlign: "middle",
          align: "right",
          color: "#e2e8f0",
          fontSize: 12,
        },
        leaves: {
          label: {
            position: "right",
            verticalAlign: "middle",
            align: "left",
            color: "#67e8f9",
            fontSize: 11,
          },
        },
        lineStyle: {
          color: "#64748b",
          width: 2,
        },
        itemStyle: {
          color: "#6366f1",
          borderColor: "#a5b4fc",
        },
      },
    ],
  };

  return (
    <ReactECharts
      option={option}
      style={{ height: "480px", width: "100%" }}
      notMerge={true}
      lazyUpdate={true}
    />
  );
}
