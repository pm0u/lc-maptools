"use client";
import { memo } from "react";
import { useMapboxMapContext } from "./mapbox-map-context";
import { cva } from "class-variance-authority";

const map = cva(["!z-0 !inset-0 !absolute"], {
  variants: {
    cursor: {
      idle: ["[&_canvas]:cursor-auto"],
      dragging: ["[&_canvas]:cursor-grabbing"],
    },
  },
});

const MapboxMap = memo(() => {
  const { mapContainerRef, mapActionState } = useMapboxMapContext();

  return (
    <div ref={mapContainerRef} className={map({ cursor: mapActionState })} />
  );
});

MapboxMap.displayName = "MapboxMap";

export { MapboxMap };
