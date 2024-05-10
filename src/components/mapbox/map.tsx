"use client";
import { useMapboxMapContext } from "./context";

export const MapboxMap = () => {
  const { mapContainerRef } = useMapboxMapContext();

  return <div ref={mapContainerRef} className="z-0 inset-0 absolute" />;
};
