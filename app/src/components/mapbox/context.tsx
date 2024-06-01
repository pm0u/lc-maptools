"use client";
import { LAND_LAYERS, useMapboxMap } from "@/hooks/mapbox-map";
import { LngLatLike, Map, MapboxGeoJSONFeature, PointLike } from "mapbox-gl";
import {
  bbox,
  bboxPolygon,
  flatten,
  lineChunk,
  transformScale,
} from "@turf/turf";
import {
  useContext,
  createContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { BBoxXY, MapboxLineFeature } from "@/types/mapbox";
import { isMultiLineString } from "@/helpers/geojson";
import { jsMap } from "@/helpers/map";

const QUERY_BBOX_SIZE = 5;
let SELECTED_FEATURES: MapboxGeoJSONFeature[] = [];
let HIGHLIGHTED_FEATURES: MapboxGeoJSONFeature[] = [];

type MapboxMapCtx = {
  map?: Map | undefined;
  mapContainer: HTMLDivElement | null;
  mapContainerRef: React.Dispatch<React.SetStateAction<HTMLDivElement | null>>;
  mapActionState: "dragging" | "idle";
  queryLngLat: (lngLat: LngLatLike) => MapboxGeoJSONFeature[];
  mapInitialized: boolean;
  selectFeature: (
    feature: MapboxGeoJSONFeature,
    options?: { removeOthers?: boolean; zoomTo?: boolean }
  ) => void;
  highlightFeature: (
    feature: MapboxGeoJSONFeature,
    options?: { removeOthers?: boolean; zoomTo?: boolean }
  ) => void;
  clearSelectedFeatures: () => void;
  clearHighlightedFeatures: () => void;
  propertiesAlongLine: (feature: MapboxLineFeature) => MapboxGeoJSONFeature[];
  zoomToFeature: (feature: MapboxGeoJSONFeature) => void;
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
        let chunks: GeoJSON.Feature<GeoJSON.LineString>[];
        if (isMultiLineString(feature)) {
          const flattened = flatten(feature);
          chunks = flattened.features
            .map(
              (feature) => lineChunk(feature, 30, { units: "feet" }).features
            )
            .flat();
        } else {
          chunks = lineChunk(feature, 10, { units: "feet" }).features;
        }

        const crossedFeatures = new jsMap<string, MapboxGeoJSONFeature>();

        chunks.forEach((chunk) => {
          const point = [
            chunk.geometry.coordinates[0][0],
            chunk.geometry.coordinates[0][1],
          ] as [number, number];
          const features = map.queryRenderedFeatures(map.project(point), {
            layers: LAND_LAYERS,
          });
          features.forEach((feature) => {
            if (feature.id) {
              if (!crossedFeatures.has(feature.id.toString()))
                crossedFeatures.set(feature.id.toString(), feature);
            } else {
              console.error("Feature missing id, skipping", feature);
            }
          });
        });
        return Array.from(crossedFeatures.values());
      }
      throw Error("Map is not initialized");
    },
    [map]
  );

  const zoomToFeature = useCallback(
    (feature: MapboxGeoJSONFeature, offset = [-140, 0] as [number, number]) => {
      if (map) {
        const bounds = bbox(
          transformScale(
            bboxPolygon(
              bbox(feature, {
                recompute: true,
              })
            ),
            0.0000000000000001
          )
        ).slice(0, 4) as BBoxXY;
        map.fitBounds(bounds, {
          pitch: map.getPitch(),
          bearing: map.getBearing(),
          offset,
        });
      }
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

  const clearHighlightedFeatures = useCallback(() => {
    HIGHLIGHTED_FEATURES.forEach((feature) => {
      map?.setFeatureState(feature, { highlighted: false });
    });
    HIGHLIGHTED_FEATURES = [];
  }, [map]);

  const selectFeature = useCallback(
    (
      feature: MapboxGeoJSONFeature,
      {
        removeOthers = true,
        zoomTo = false,
      }: { removeOthers?: boolean; zoomTo?: boolean } = {
        removeOthers: true,
        zoomTo: false,
      }
    ) => {
      if (map) {
        if (removeOthers) {
          clearSelectedFeatures();
          SELECTED_FEATURES = [feature];
        } else {
          SELECTED_FEATURES = [...SELECTED_FEATURES, feature];
        }
        map.setFeatureState(feature, { selected: true });
        if (zoomTo) {
          zoomToFeature(feature);
        }
      }
    },
    [map, clearSelectedFeatures, zoomToFeature]
  );

  const highlightFeature = useCallback(
    (
      feature: MapboxGeoJSONFeature,
      {
        removeOthers = true,
        zoomTo = false,
      }: { removeOthers?: boolean; zoomTo?: boolean } = {
        removeOthers: true,
        zoomTo: false,
      }
    ) => {
      if (map) {
        if (removeOthers) {
          clearHighlightedFeatures();
          HIGHLIGHTED_FEATURES = [feature];
        } else {
          HIGHLIGHTED_FEATURES = [...HIGHLIGHTED_FEATURES, feature];
        }
        map.setFeatureState(feature, { highlighted: true });
        if (zoomTo) {
          zoomToFeature(feature);
        }
      }
    },
    [map, clearHighlightedFeatures, zoomToFeature]
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
        zoomToFeature,
        highlightFeature,
        clearHighlightedFeatures,
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
