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

  // 🔥 Dynamisk horisontal beregning
  const minLeft = Math.min(
    ...tables.map(t => t.render.leftPercent - t.render.widthPercent / 2)
  );

  const maxRight = Math.max(
    ...tables.map(t => t.render.leftPercent + t.render.widthPercent / 2)
  );

  const totalWidth = maxRight - minLeft;

  // Skalér kun hvis layout fylder mere end 100%
  const scale = totalWidth > 100 ? 100 / totalWidth : 1;

  return (
    <div
      className="relative w-full"
      style={{
        aspectRatio: aspectRatio ?? 1.5,
      }}
    >
      {tables.map((table) => {
        const isActive = table.id === activeTableId;

        const normalizedLeft =
          (table.render.leftPercent - minLeft) * scale;

        const normalizedWidth =
          table.render.widthPercent * scale;

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
              left: `${normalizedLeft}%`,
              width: `${normalizedWidth}%`,
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