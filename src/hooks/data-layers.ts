import { useMapboxMapContext } from "@/components/mapbox/context";
import { randomColor } from "@/lib/color";
import { useCallback, useState } from "react";
import tinycolor from "tinycolor2";

type DataLayers = {
  [key: string]: {
    layer: GeoJSON.FeatureCollection;
    color: string;
    visible: boolean;
  };
};

export const useDataLayers = () => {
  const { map } = useMapboxMapContext();
  const [dataLayers, setDataLayers] = useState<DataLayers>({});

  const addLayer = useCallback(
    ({
      id,
      layer,
      color,
    }: {
      id?: string;
      layer: GeoJSON.FeatureCollection;
      color?: string;
    }) => {
      if (map) {
        const layerColor = color ?? randomColor();
        const layerId = id ?? `Layer ${Object.keys(dataLayers).length}`;
        setDataLayers((l) => ({
          ...l,
          [layerId]: {
            layer,
            color: layerColor,
            visible: true,
          },
        }));
        map.addSource(layerId, {
          type: "geojson",
          data: layer,
        });
        map.addLayer({
          id: `${layerId}-lines`,
          source: id,
          type: "line",
          paint: {
            "line-color": layerColor,
            "line-width": 4,
          },
          filter: ["==", "$type", "LineString"],
        });
        map.addLayer({
          id: `${id}-polygons`,
          source: id,
          type: "fill",
          paint: {
            "fill-color": layerColor,
            "fill-outline-color": tinycolor(layerColor).darken().toHexString(),
          },
          filter: ["==", "$type", "Polygon"],
        });
      } else {
        console.error("Map is not initialized");
      }
    },
    [map, dataLayers]
  );

  const removeLayer = useCallback(
    (id: string) => {
      if (id in dataLayers) {
        setDataLayers((layers) => {
          const { [id]: removed, ...remaining } = layers;
          return remaining;
        });
        map?.removeSource(id);
        map?.removeLayer(id);
      } else {
        console.error(`layer "${id}" not found in layers`);
      }
    },
    [map, dataLayers]
  );

  const setLayerColor = useCallback(
    ({ id, color }: { id: string; color: string }) => {
      setDataLayers((layers) => {
        const { [id]: toUpdate, ...rest } = layers;
        return {
          [id]: {
            ...toUpdate,
            color,
          },
          ...rest,
        };
      });
    },
    []
  );

  return { addLayer, removeLayer, setLayerColor, layers: dataLayers };
};
