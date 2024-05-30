"use client";
import { LAND_LAYERS, useMapboxMap } from "@/hooks/mapbox-map";
import { LngLatLike, Map, MapboxGeoJSONFeature, PointLike } from "mapbox-gl";
import { flatten, lineChunk } from "@turf/turf";
import {
  useContext,
  createContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { MapboxLineFeature } from "@/types/mapbox";
import { isMultiLineString } from "@/helpers/geojson";
import { jsMap } from "@/helpers/map";

const QUERY_BBOX_SIZE = 5;
let SELECTED_FEATURES: MapboxGeoJSONFeature[] = [];

type MapboxMapCtx = {
  map?: Map | undefined;
  mapContainer: HTMLDivElement | null;
  mapContainerRef: React.Dispatch<React.SetStateAction<HTMLDivElement | null>>;
  mapActionState: "dragging" | "idle";
  queryLngLat: (lngLat: LngLatLike) => MapboxGeoJSONFeature[];
  mapInitialized: boolean;
  selectFeature: (feature: MapboxGeoJSONFeature) => void;
  clearSelectedFeatures: () => void;
  propertiesAlongLine: (feature: MapboxLineFeature) => MapboxGeoJSONFeature[];
};

// @ts-expect-error filled in in the context provider
const MapboxMapContext = createContext<MapboxMapCtx>({});

export const MapboxMapProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { map, mapContainer, mapContainerRef, mapInitialized, layers } =
    useMapboxMap();
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

  const propertiesAlongLine = useCallback(
    (feature: MapboxLineFeature) => {
      if (map) {
        console.log({ feature });
        let chunks: GeoJSON.Feature<GeoJSON.LineString>[];
        if (isMultiLineString(feature)) {
          console.log("isMultiLineString");
          const flattened = flatten(feature);
          console.log({ flattened });
          chunks = flattened.features
            .map(
              (feature) => lineChunk(feature, 30, { units: "feet" }).features
            )
            .flat();
          console.log({ chunks });
        } else {
          chunks = lineChunk(feature, 10, { units: "feet" }).features;
        }

        const crossedFeatures: MapboxGeoJSONFeature[] = [];

        chunks.forEach((chunk) => {
          console.log({ chunk });
          const point = [
            chunk.geometry.coordinates[0][0],
            chunk.geometry.coordinates[0][1],
          ] as [number, number];
          const features = map.queryRenderedFeatures(map.project(point), {
            layers: LAND_LAYERS,
          });
          console.log({ features, point });
          features.forEach((feature) => {
            if (feature.id) {
              if (
                crossedFeatures.every((_feature) => feature.id !== _feature.id)
              )
                crossedFeatures.push(feature);
            } else {
              console.error("Feature missing id, skipping", feature);
            }
          });
        });
        return crossedFeatures;
      }
      throw Error("Map is not initialized");
    },
    [map]
  );

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

  const clearSelectedFeatures = useCallback(() => {
    SELECTED_FEATURES.forEach((feature) => {
      map?.setFeatureState(feature, { selected: false });
    });
    SELECTED_FEATURES = [];
  }, [map]);

  const selectFeature = useCallback(
    (feature: MapboxGeoJSONFeature, removeOthers = true) => {
      if (map) {
        if (removeOthers) {
          clearSelectedFeatures();
          SELECTED_FEATURES = [feature];
        } else {
          SELECTED_FEATURES = [...SELECTED_FEATURES, feature];
        }
        map.setFeatureState(feature, { selected: true });
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
        clearSelectedFeatures,
        propertiesAlongLine,
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
