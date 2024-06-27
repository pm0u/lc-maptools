"use client";
import { LAND_LAYERS, useMapboxMap } from "@/hooks/mapbox-map";
import { LngLatLike, Map, MapboxGeoJSONFeature, PointLike } from "mapbox-gl";
import { bbox, flatten, lineChunk, pointOnFeature } from "@turf/turf";
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
import { useRouter } from "next/navigation";
import { uniqBy } from "lodash";

const QUERY_BBOX_SIZE = 5;
let SELECTED_FEATURES: MapboxGeoJSONFeature[] = [];
let HIGHLIGHTED_FEATURES: MapboxGeoJSONFeature[] = [];

type MapboxMapCtx = {
  map?: Map | undefined;
  mapContainerRef: React.Dispatch<React.SetStateAction<HTMLDivElement | null>>;
  mapActionState: "dragging" | "idle";
  queryLngLat: (
    lngLat: LngLatLike,
    options?: { dedupe: boolean }
  ) => MapboxGeoJSONFeature[];
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
  zoomToFeature: (
    feature: MapboxGeoJSONFeature,
    options?: { offset?: [number, number]; pitch?: number }
  ) => void;
  zoomAndQueryFeature: (feature: MapboxGeoJSONFeature) => void;
  toggleLayer: (layerId: string) => void;
  isLayerVisible: (layerId: string) => boolean;
  layers: string[];
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
  const router = useRouter();

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
              (feature) => lineChunk(feature, 10, { units: "feet" }).features
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
    (
      feature: MapboxGeoJSONFeature,
      {
        offset = [-140, 0],
        pitch,
      }: { offset?: [number, number]; pitch?: number } = {
        offset: [-140, 0] as [number, number],
      }
    ) => {
      if (map) {
        const bounds = bbox(feature, {
          recompute: true,
        }).slice(0, 4) as BBoxXY;
        map.fitBounds(bounds, {
          pitch: pitch ?? map.getPitch(),
          bearing: map.getBearing(),
          offset,
        });
        // BBox is too big for some reason, so get a little closer
        map.once("moveend", () => {
          map.zoomIn();
        });
      }
    },
    [map]
  );

  const queryLngLat = useCallback(
    (
      lngLat: LngLatLike,
      { dedupe = true }: { dedupe: boolean } = { dedupe: true }
    ) => {
      if (map) {
        const point = map.project(lngLat);
        const bbox = [
          [point.x - QUERY_BBOX_SIZE, point.y - QUERY_BBOX_SIZE],
          [point.x + QUERY_BBOX_SIZE, point.y + QUERY_BBOX_SIZE],
        ] as [PointLike, PointLike];
        const features = map.queryRenderedFeatures(bbox);
        if (!dedupe) return features;
        const deduped = uniqBy(features, (feature) => feature.id);
        return deduped;
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

  const zoomAndQueryFeature = useCallback(
    (feature: MapboxGeoJSONFeature) => {
      if (map) {
        const point = pointOnFeature(feature);
        const features = queryLngLat(
          point.geometry.coordinates.slice(0, 2) as [number, number]
        );
        const featureInd = features.findIndex(
          (queriedFeature) => queriedFeature.id === feature.id
        );
        clearSelectedFeatures();
        clearHighlightedFeatures();
        router.push(
          `/query/${point.geometry.coordinates
            .slice(0, 2)
            .join(",")}?feature=${featureInd}`
        );
        setTimeout(() => {
          zoomToFeature(feature);
        }, 1);
      }
    },
    [
      router,
      zoomToFeature,
      map,
      queryLngLat,
      clearSelectedFeatures,
      clearHighlightedFeatures,
    ]
  );

  const toggleLayer = useCallback(
    (layerId: (typeof layers)[number]) => {
      if (map) {
        map.setLayoutProperty(
          layerId,
          "visibility",
          map.getLayoutProperty(layerId, "visibility") !== "none"
            ? "none"
            : "visible"
        );
      }
    },
    [map]
  );

  const isLayerVisible = useCallback(
    (layerId: (typeof layers)[number]) => {
      if (map) {
        return map.getLayoutProperty(layerId, "visibility") !== "none";
      }
      return false;
    },
    [map]
  );

  return (
    <MapboxMapContext.Provider
      value={{
        map,
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
        zoomAndQueryFeature,
        toggleLayer,
        isLayerVisible,
        layers,
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
