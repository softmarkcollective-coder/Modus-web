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

  return (
    <div
      className="relative w-full"
      style={{ aspectRatio: 1.5 }}
    >
      {tables.map((table) => {

        const isActive = table.id === activeTableId;

        // ✅ Korrekt visuel størrelse
        const width =
          table.shape === "round"
            ? table.render.heightPercent
            : table.orientation === "vertical"
            ? table.render.heightPercent
            : table.render.widthPercent;

        const height =
          table.shape === "round"
            ? table.render.heightPercent
            : table.orientation === "vertical"
            ? table.render.widthPercent
            : table.render.heightPercent;

        // ✅ Position beregnes EFTER width/height er fastlagt
        const left =
          table.render.leftPercent - width / 2;

        const top =
          table.render.topPercent - height / 2;

        return (
          <div
            key={table.id}
            className={`absolute flex items-center justify-center text-sm font-semibold transition-all
              ${table.shape === "round" ? "rounded-full" : "rounded-xl"}
              ${
                isActive
                  ? "bg-gradient-to-br from-[#f0d78c] to-[#b8932f] text-black shadow-[0_0_28px_rgba(214,178,94,0.6)]"
                  : "bg-neutral-700 text-neutral-300"
              }`}
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: `${width}%`,
              height: `${height}%`,
            }}
          >
            {table.id}
          </div>
        );
      })}
    </div>
  );
}