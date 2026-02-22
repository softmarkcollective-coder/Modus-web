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
  aspectRatio?: number;
}

export default function WideUShapeLayout({
  tables,
  activeTableId,
  aspectRatio,
}: Props) {

  // 🔒 Indre sikkerhedszone (4% på hver side)
  const SAFE_MARGIN = 4;       // %
  const SCALE = 100 - SAFE_MARGIN * 2; // 92%

  return (
    <div
      className="relative w-full"
      style={{
        aspectRatio: aspectRatio ?? 1.5,
      }}
    >
      {tables.map((table) => {
        const isActive = table.id === activeTableId;

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
              // ✅ Horisontal safety scaling
              left: `calc(${table.render.leftPercent}% * ${SCALE / 100} + ${SAFE_MARGIN}%)`,
              width: `calc(${table.render.widthPercent}% * ${SCALE / 100})`,

              // Vertikal bevares 1:1
              top: `${table.render.topPercent}%`,
              height: `${table.render.heightPercent}%`,

              transform: "translate(-50%, -50%)",
            }}
          >
            {table.id}
          </div>
        );
      })}
    </div>
  );
}