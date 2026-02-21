"use client";

import BaseColumnLayout from "./BaseColumnLayout";

interface Table {
  id: number;
  x: number;
  y: number;
  shape: string;
  orientation?: "horizontal" | "vertical";
  size?: number;
  render: {
    leftPercent: number;
    topPercent: number;
    widthPercent: number;
    heightPercent: number;
  };
}

interface Props {
  tables: Table[];
  activeTableId: number | null;
}

export default function LongTablesLayout({
  tables,
  activeTableId,
}: Props) {

  return (
    <BaseColumnLayout
      tables={tables}
      activeTableId={activeTableId}
      config={{
        columnGap: "gap-8",
        rowGap: "gap-6",
        baseUnit: 50,
        roundSize: 60,
        paddingX: "px-2",
      }}
    />
  );
}