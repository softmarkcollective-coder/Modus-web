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

interface Props {
  tables: Table[];
  activeTableId: number | null;
}

export default function GridLayout({
  tables,
  activeTableId,
}: Props) {

  // Find alle unikke kolonner (x)
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
      className="grid gap-6 text-center"
      style={{
        gridTemplateColumns: `repeat(${columns.length}, minmax(0,1fr))`,
      }}
    >
      {columns.map((column, colIndex) => (
        <div
          key={colIndex}
          className="flex flex-col gap-6 items-center"
        >
          {column.map((table) => {

            const isActive = table.id === activeTableId;
            const baseUnit = 44;

            const width =
              table.shape === "round"
                ? 56
                : table.orientation === "horizontal"
                ? baseUnit * (table.size ?? 1)
                : baseUnit;

            const height =
              table.shape === "round"
                ? 56
                : table.orientation === "horizontal"
                ? baseUnit
                : baseUnit * (table.size ?? 1);

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