"use client";

import UShapeLayout from "./UShapeLayout";
import WideUShapeLayout from "./WideUShapeLayout";
import LongTablesLayout from "./LongTablesLayout";
import TheaterLayout from "./TheaterLayout";
import Banquet3Layout from "./Banquet3Layout";
import Banquet5Layout from "./Banquet5Layout";
import CustomLayout from "./CustomLayout";

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
  type?: string | null;
  tables: Table[];
  activeTableId: number | null;
  metadata?: {
    aspectRatio?: number;
  };
}

export default function LayoutRenderer({
  type,
  tables,
  activeTableId,
  metadata,
}: Props) {

  // 🔒 Defensiv sikring
  const safeTables = Array.isArray(tables) ? tables : [];

  // 🔒 Normaliser type fra backend
  const layoutType = (type ?? "custom").toLowerCase().trim();

  switch (layoutType) {

    case "u-shape":
      return (
        <UShapeLayout
          tables={safeTables}
          activeTableId={activeTableId}
        />
      );

    case "wide-u-shape":
      return (
        <WideUShapeLayout
          tables={safeTables}
          activeTableId={activeTableId}
          aspectRatio={metadata?.aspectRatio}
        />
      );

    case "long-tables":
      return (
        <LongTablesLayout
          tables={safeTables}
          activeTableId={activeTableId}
        />
      );

    case "theater":
      return (
        <TheaterLayout
          tables={safeTables}
          activeTableId={activeTableId}
        />
      );

    case "banquet-3":
      return (
        <Banquet3Layout
          tables={safeTables}
          activeTableId={activeTableId}
        />
      );

    case "banquet-5":
      return (
        <Banquet5Layout
          tables={safeTables}
          activeTableId={activeTableId}
        />
      );

    case "custom":
    default:
      return (
        <CustomLayout
          tables={safeTables}
          activeTableId={activeTableId}
        />
      );
  }
}