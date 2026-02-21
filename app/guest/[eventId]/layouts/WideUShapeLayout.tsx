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
  return (
    <div className="relative w-full">
      <div
        className="relative w-full"
        style={{
          aspectRatio: aspectRatio ?? 1.5,
        }}
      >
        {/* Indre safe zone så procenter matcher mobilens canvas */}
        <div className="absolute inset-0 px-[6%] py-[6%]">
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
                  left: `${table.render.leftPercent}%`,
                  top: `${table.render.topPercent}%`,
                  width: `${table.render.widthPercent}%`,
                  height: `${table.render.heightPercent}%`,
                }}
              >
                {table.id}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}