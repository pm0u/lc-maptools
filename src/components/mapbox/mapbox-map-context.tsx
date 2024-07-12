"use client";
import { useMapboxMap } from "@/hooks/mapbox-map";
import mapboxgl, {
  LngLatLike,
  Map,
  MapboxGeoJSONFeature,
  PointLike,
} from "mapbox-gl";
import { bbox, pointOnFeature } from "@turf/turf";
import {
  useContext,
  createContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { BBoxXY } from "@/types/mapbox";
import { useRouter } from "next/navigation";
import { uniqBy } from "lodash";

const QUERY_BBOX_SIZE = 5;
let SELECTED_FEATURES: mapboxgl.FeatureIdentifier[] = [];
let HIGHLIGHTED_FEATURES: mapboxgl.FeatureIdentifier[] = [];

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
    feature: mapboxgl.FeatureIdentifier,
    options?: { removeOthers?: boolean; zoomTo?: boolean }
  ) => void;
  highlightFeature: (
    feature: mapboxgl.FeatureIdentifier,
    options?: { removeOthers?: boolean; zoomTo?: boolean }
  ) => void;
  clearSelectedFeatures: () => void;
  clearHighlightedFeatures: () => void;
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
        return uniqBy(features, (feature) => feature.id);
      }
      throw Error("Map is not initialized");
    },
    [map]
  );

  const clearSelectedFeatures = useCallback(() => {
    SELECTED_FEATURES.forEach((feature) => {
      if (map) {
        map.setFeatureState(feature, { selected: false });
      }
    });
    SELECTED_FEATURES = [];
  }, [map]);

  const clearHighlightedFeatures = useCallback(() => {
    HIGHLIGHTED_FEATURES.forEach((feature) => {
      if (map) {
        map.setFeatureState(feature, { highlighted: false });
      }
    });
    HIGHLIGHTED_FEATURES = [];
  }, [map]);

  const selectFeature = useCallback(
    (
      feature: mapboxgl.FeatureIdentifier,
      { removeOthers = true }: { removeOthers?: boolean } = {
        removeOthers: true,
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
      }
    },
    [map, clearSelectedFeatures]
  );

  const highlightFeature = useCallback(
    (
      feature: mapboxgl.FeatureIdentifier,
      { removeOthers = true }: { removeOthers?: boolean } = {
        removeOthers: true,
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
      }
    },
    [map, clearHighlightedFeatures]
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
        console.log(map.getLayoutProperty(layerId, "visibility"));
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
