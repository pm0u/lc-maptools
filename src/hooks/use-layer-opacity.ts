import { useMapboxMapContext } from "@/components/mapbox/mapbox-map-context";
import mapboxgl from "mapbox-gl";
import { useCallback, useEffect, useState } from "react";

export const useLayerOpacity = (layerId: string) => {
  const { map, mapInitialized } = useMapboxMapContext();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [opacityProperty, setOpacityProperty] = useState<string | null>(null);
  const [opacity, _setOpacity] = useState<number | null>(null);

  useEffect(() => {
    if (mapInitialized && map) {
      setReady(false);
      setError(null);
      const layer = map.getLayer(layerId);
      if (layer) {
        try {
          const property = getPaintProperty(layer);
          const _opacity = map.getPaintProperty(layerId, property);
          setOpacityProperty(property);
          _setOpacity(
            typeof _opacity === "undefined" ? 100 : Math.round(_opacity * 100)
          );
          setReady(true);
        } catch (e) {
          setError(e as string);
        }
      }
    }
  }, [mapInitialized, layerId, map]);

  /**
   * 0 - 1
   */
  const setOpacity = useCallback(
    (newOpacity: number) => {
      if (newOpacity === opacity) return;
      _setOpacity(newOpacity);
    },
    [opacity]
  );

  useEffect(() => {
    if (layerId && opacityProperty && opacity !== null) {
      map?.setPaintProperty(layerId, opacityProperty, opacity / 100);
    }
  }, [opacity, layerId, opacityProperty, map]);

  return {
    ready,
    opacity,
    setOpacity,
    error,
  };
};

const isLineLayer = (layer: mapboxgl.AnyLayer): layer is mapboxgl.LineLayer => {
  return layer.type === "line";
};

const isFillLayer = (layer: mapboxgl.AnyLayer): layer is mapboxgl.LineLayer => {
  return layer.type === "fill";
};

const getPaintProperty = (layer: mapboxgl.AnyLayer) => {
  if (isLineLayer(layer)) {
    return "line-opacity";
  }
  if (isFillLayer(layer)) {
    return "fill-opacity";
  }
  throw Error(`Unable to determine opacity setting for layer "${layer.id}"`);
};
