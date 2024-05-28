"use client";
import { getSelectedPaintProperties } from "@/config/styles";
import { useMapboxMap } from "@/hooks/mapbox-map";
import { LngLatLike, Map, MapboxGeoJSONFeature, PointLike } from "mapbox-gl";
import {
  useContext,
  createContext,
  useEffect,
  useState,
  useCallback,
} from "react";

const QUERY_BBOX_SIZE = 5;

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
  const {
    map,
    mapContainer,
    mapContainerRef,
    mapInitialized,
    selectionLayers,
    layers,
  } = useMapboxMap();
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
        return map.queryRenderedFeatures(bbox, { layers });
      }
      throw Error("Map is not initialized");
    },
    [map, layers]
  );

  const clearSelectedFeatures = useCallback(() => {
    if (map) {
      selectionLayers.forEach((layer) => {
        map.setPaintProperty(layer, "line-color", "transparent");
      });
    }
  }, [map, selectionLayers]);

  const selectFeature = useCallback(
    (feature: MapboxGeoJSONFeature) => {
      clearSelectedFeatures();
      if (map) {
        const layerId = `${feature.sourceLayer ?? feature.source}_selected`;
        const [paintProperty, expression] = getSelectedPaintProperties(feature);
        map.setPaintProperty(layerId, paintProperty, expression);
      }
    },
    [map, clearSelectedFeatures]
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
