"use client";
import { useMapboxMapContext } from "./context";

export const MapboxMap = () => {
  const { mapContainerRef } = useMapboxMapContext();

  return <div ref={mapContainerRef} className="h-full w-full" />;
};
