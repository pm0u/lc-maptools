"use client";
import { useMapboxMapContext } from "./context";
import { cva } from "class-variance-authority";

const map = cva(["!z-0 !inset-0 !absolute"], {
  variants: {
    cursor: {
      idle: ["[&_canvas]:cursor-auto"],
      dragging: ["[&_canvas]:cursor-grabbing"],
    },
  },
});

export const MapboxMap = () => {
  const { mapContainerRef, mapActionState } = useMapboxMapContext();

  return (
    <div ref={mapContainerRef} className={map({ cursor: mapActionState })} />
  );
};
