"use client";
import { useMapboxMap } from "@/hooks/mapbox-map";
import { LngLatLike, Map, MapboxGeoJSONFeature, PointLike } from "mapbox-gl";
import {
  useContext,
  createContext,
  useEffect,
  useState,
  useCallback,
} from "react";

const QUERY_BBOX_SIZE = 1;

type MapboxMapCtx = {
  map?: Map | undefined;
  mapContainer: HTMLDivElement | null;
  mapContainerRef: React.Dispatch<React.SetStateAction<HTMLDivElement | null>>;
  mapActionState: "dragging" | "idle";
  queryLngLat: (lngLat: LngLatLike) => MapboxGeoJSONFeature[];
  mapInitialized: boolean;
  selectFeature: (feature: MapboxGeoJSONFeature) => void;
};

// @ts-expect-error filled in in the context provider
const MapboxMapContext = createContext<MapboxMapCtx>({});

export const MapboxMapProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { map, mapContainer, mapContainerRef, mapInitialized } = useMapboxMap();
  const [mapActionState, setMapActionState] = useState<"idle" | "dragging">(
    "idle"
  );

  useEffect(() => {
    const onDragStart = () => {
      setMapActionState("dragging");
    };

    const onDragEnd = () => {
      setMapActionState("idle");
    };

    map?.on("dragstart", onDragStart);
    map?.on("dragend", onDragEnd);

    return () => {
      map?.off("dragstart", onDragStart);
      map?.off("dragend", onDragEnd);
    };
  }, [map]);

  const queryLngLat = useCallback(
    (lngLat: LngLatLike) => {
      if (map) {
        const point = map.project(lngLat);
        const bbox = [
          [point.x - QUERY_BBOX_SIZE, point.y - QUERY_BBOX_SIZE],
          [point.x + QUERY_BBOX_SIZE, point.y + QUERY_BBOX_SIZE],
        ] as [PointLike, PointLike];
        return map.queryRenderedFeatures(bbox);
      }
      throw Error("Map is not initialized");
    },
    [map]
  );

  const selectFeature = useCallback(
    (feature: MapboxGeoJSONFeature) => {
      if (map) {
        let source;
        if (
          feature.geometry.type === "LineString" ||
          feature.geometry.type === "MultiLineString"
        ) {
          source = map.getSource("selected-line-features");
        } else if (
          feature.geometry.type === "Polygon" ||
          feature.geometry.type === "MultiPolygon"
        ) {
          source = map.getSource("selected-fill-features");
        }
        if (source && source.type === "geojson") {
          source.setData(feature);
        }
      }
    },
    [map]
  );

  return (
    <MapboxMapContext.Provider
      value={{
        map,
        mapContainer,
        mapContainerRef,
        mapActionState,
        queryLngLat,
        mapInitialized,
        selectFeature,
      }}
    >
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
