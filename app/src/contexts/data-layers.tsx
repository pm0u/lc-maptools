"use client";

import { useMapboxMapContext } from "@/components/mapbox/mapbox-map-context";
import { randomColor } from "~data";
import { useCallback, useContext, useState, createContext } from "react";
import tinycolor from "tinycolor2";
import { bbox } from "@turf/turf";
import type { BBox } from "geojson";
import slugify from "slugify";

type DataLayers = {
  [key: string]: {
    id: string;
    name: string;
    layer: GeoJSON.FeatureCollection;
    color: string;
    visible: boolean;
    featureBounds: BBox;
  };
};

type DataLayersContextType = {
  layers: DataLayers;
  addLayer: (args: {
    name: string;
    layer: GeoJSON.FeatureCollection;
    color?: string;
  }) => { id: string };
  zoomToFeature: (id: string) => void;
  removeLayer: (id: string) => void;
  setLayerColor: (args: { id: string; color: string }) => void;
};

// @ts-expect-error
const DataLayersContext = createContext<DataLayersContextType>({});

export const DataLayersProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { map } = useMapboxMapContext();
  const [dataLayers, setDataLayers] = useState<DataLayers>({});

  const addLayer = useCallback(
    ({
      name,
      layer,
      color,
    }: {
      name: string;
      layer: GeoJSON.FeatureCollection;
      color?: string;
    }) => {
      if (!map) {
        throw Error("Map not initialized");
      }
      const layerColor = color ?? randomColor();
      const id = slugify(name.toLowerCase());
      setDataLayers((l) => ({
        ...l,
        [id]: {
          id,
          name,
          layer,
          color: layerColor,
          visible: true,
          featureBounds: bbox(layer),
        },
      }));
      map.addSource(id, {
        type: "geojson",
        data: layer,
      });
      map.addLayer({
        id: `${id}-lines`,
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
      return {
        id,
      };
    },
    [map]
  );

  const zoomToFeature = useCallback(
    (id: string) => {
      if (!map) {
        throw Error("Map not initialized");
      }
      if (!(id in dataLayers)) {
        throw Error(`Layer ${id} not in data layers`);
      }
      map.fitBounds(
        dataLayers[id].featureBounds.slice(0, 4) as [
          number,
          number,
          number,
          number
        ],
        { duration: 1000, padding: 20 }
      );
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

  return (
    <DataLayersContext.Provider
      value={{
        addLayer,
        removeLayer,
        setLayerColor,
        layers: dataLayers,
        zoomToFeature,
      }}
    >
      {children}
    </DataLayersContext.Provider>
  );
};

export const useDataLayers = () => {
  const ctx = useContext(DataLayersContext);
  if (!ctx) throw Error("Not inside provider");
  return ctx;
};
