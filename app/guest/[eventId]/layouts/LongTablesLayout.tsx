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

export default function LongTablesLayout({
  tables,
  activeTableId,
}: Props) {

  // 🔥 Sorter vertikalt efter y (samme logik som appen)
  const sortedTables = [...tables].sort((a, b) => a.y - b.y);

  return (
    <div
      className="flex flex-col items-center gap-4 w-full"
      style={{ aspectRatio: 1.5 }}
    >
      {sortedTables.map((table) => {

        const isActive = table.id === activeTableId;

        const baseUnit = 50;
        const roundSize = 60;

        const width =
          table.shape === "round"
            ? roundSize
            : table.orientation === "horizontal"
            ? baseUnit * (table.size ?? 1)
            : baseUnit;

        const height =
          table.shape === "round"
            ? roundSize
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
            style={{
              width,
              height,
            }}
          >
            {table.id}
          </div>
        );
      })}
    </div>
  );
}