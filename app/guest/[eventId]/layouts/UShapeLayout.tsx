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

export default function UShapeLayout({
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

        const left =
          table.render.leftPercent - table.render.widthPercent / 2;

        const top =
          table.render.topPercent - table.render.heightPercent / 2;

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
              width: `${table.render.widthPercent}%`,
              height: `${table.render.heightPercent}%`,
            }}
          >
            {table.id}
          </div>
        );
      })}
    </div>
  );
}