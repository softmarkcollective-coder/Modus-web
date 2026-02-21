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

export default function TheaterLayout({
  tables,
  activeTableId,
}: Props) {

  return (
    <BaseColumnLayout
      tables={tables}
      activeTableId={activeTableId}
      config={{
        columnGap: "gap-4",
        rowGap: "gap-2",
        baseUnit: 36,
        roundSize: 44,
        paddingX: "px-1",
      }}
    />
  );
}