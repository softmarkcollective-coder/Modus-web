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

export default function Banquet3Layout({
  tables,
  activeTableId,
}: Props) {

  return (
    <BaseColumnLayout
      tables={tables}
      activeTableId={activeTableId}
      config={{
        columnGap: "gap-8",
        rowGap: "gap-8",
        baseUnit: 46,
        roundSize: 64,
        paddingX: "px-2",
      }}
    />
  );
}