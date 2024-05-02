"use client";
import { useMapboxMap } from "@/hooks/mapbox-map";
import { Map } from "mapbox-gl";
import { useContext, createContext } from "react";

type MapboxMapCtx = {
  map?: Map | undefined;
  mapContainer: HTMLDivElement | null;
  mapContainerRef: React.Dispatch<React.SetStateAction<HTMLDivElement | null>>;
};

// @ts-expect-error filled in in the context provider
const MapboxMapContext = createContext<MapboxMapCtx>({});

export const MapboxMapProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { map, mapContainer, mapContainerRef } = useMapboxMap();

  return (
    <MapboxMapContext.Provider value={{ map, mapContainer, mapContainerRef }}>
      {children}
    </MapboxMapContext.Provider>
  );
};

export const useMapboxMapContext = () => {
  const ctx = useContext(MapboxMapContext);
  if (!ctx)
    throw new Error(
      "useMapboxMapContext must be used in child of MapboxMapProvider!!"
    );
  return ctx;
};
