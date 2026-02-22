"use client";

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

interface LayoutConfig {
  columnGap: string;   // fx "gap-4"
  rowGap: string;      // fx "gap-3"
  baseUnit: number;    // størrelse-skalering
  roundSize: number;   // størrelse på runde borde
  paddingX?: string;   // fx "px-1"
}

interface Props {
  tables: Table[];
  activeTableId: number | null;
  config: LayoutConfig;
}

export default function BaseColumnLayout({
  tables,
  activeTableId,
  config,
}: Props) {

  const columnKeys = Array.from(
    new Set(tables.map((t) => t.x))
  ).sort((a, b) => a - b);

  const columns = columnKeys.map((key) =>
    tables
      .filter((t) => t.x === key)
      .sort((a, b) => a.y - b.y)
  );

  return (
    <div
      className={`grid ${config.columnGap} text-center`}
      style={{
        gridTemplateColumns: `repeat(${columns.length}, auto)`,
      }}
    >
      {columns.map((column, colIndex) => (
        <div
          key={colIndex}
          className={`flex flex-col ${config.rowGap} items-center ${config.paddingX ?? ""}`}
        >
          {column.map((table) => {

            const isActive = table.id === activeTableId;

            const width =
              table.shape === "round"
                ? config.roundSize
                : table.orientation === "horizontal"
                ? config.baseUnit * (table.size ?? 1)
                : config.baseUnit;

            const height =
              table.shape === "round"
                ? config.roundSize
                : table.orientation === "horizontal"
                ? config.baseUnit
                : config.baseUnit * (table.size ?? 1);

            return (
              <div
                key={table.id}
                className={`flex items-center justify-center text-sm font-semibold transition-all
                  ${table.shape === "round" ? "rounded-full" : "rounded-xl"}
                  ${
                    isActive
                      ? "bg-gradient-to-br from-[#f0d78c] to-[#b8932f] text-black shadow-[0_0_28px_rgba(214,178,94,0.6)]"
                      : "bg-neutral-700 text-neutral-300"
                  }`}
                style={{ width, height }}
              >
                {table.id}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}