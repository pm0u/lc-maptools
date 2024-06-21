import { useState, useEffect, useCallback } from "react";
import mapboxgl, { Map, MapEventType } from "mapbox-gl";
import layerStyles from "~data/generated/tax_parcels-layer-styles.json";
import oldLayerStyles from "~data/generated/tax_parcels_old-layer-styles.json";
import publicLandStyles from "~data/generated/public_land-layer-styles.json";
import { useRouterWithHash } from "@/hooks/use-router-with-hash";
import { mapboxToken, tileDomain } from "@/env";
import {
  HIGHLIGHTED_FILL_STYLE,
  HIGHLIGHTED_LINE_STYLE,
  SELECTED_FILL_STYLE,
  SELECTED_LINE_STYLE,
  getLineWidth,
} from "@/config/styles";
import { getHighlightLayer, getSelectedLayer } from "@/lib/layers";

export const LAND_LAYERS = ["tax_parcels", "public_land", "tax_parcels_old"];

export const useMapboxMap = () => {
  const [map, setMap] = useState<Map>();
  const [mapInitialized, setMapInitialized] = useState(false);
  const [mapContainer, mapContainerRef] = useState<HTMLDivElement | null>(null);
  const router = useRouterWithHash();
  const [selectionLayers, setSelectionlayers] = useState<string[]>([]);
  const [highlightLayers, setHighlightLayers] = useState<string[]>([]);
  const [layers, setLayers] = useState<string[]>([]);

  const onMapRender = useCallback((e: MapEventType["render"]) => {
    const { target: map } = e;
    if (map.areTilesLoaded()) {
      setMapInitialized(true);
      map.off("render", onMapRender);
    }
  }, []);

  const onClick = useCallback(
    (e: mapboxgl.MapMouseEvent) => {
      const {
        lngLat: { lng, lat },
      } = e;
      router.push(`/query/${lng},${lat}`);
    },
    [router]
  );

  useEffect(() => {
    if (mapContainer && mapContainer !== map?.getContainer()) {
      if (map) {
        setMapInitialized(false);
        map.off("render", onMapRender);
        map.off("click", onClick);
        map.remove();
      }
      const _map = new Map({
        accessToken: mapboxToken,
        container: mapContainer,
        hash: true,
        // Leadville
        center: [-106.3335, 39.22324],
        zoom: 10,
        maxZoom: 22,
      });
      setMap(_map);
      _map.on("load", () => {
        // To trigger events that are waiting on tile data
        _map.on("render", onMapRender);

        _map.addSource("LCMDParcels", {
          type: "vector",
          tiles: [`${tileDomain}/tiles/{z}/{x}/{y}`],
          maxzoom: 16,
        });

        // Layers
        const { highlightedLayers, selectedLayers } = addSelectableLayers(
          [
            {
              id: "tax_parcels",
              slot: "bottom",
              source: "LCMDParcels",
              "source-layer": "tax_parcels",
              type: "fill",
              // @ts-expect-error
              paint: layerStyles,
            },
            {
              id: "tax_parcels_old",
              slot: "bottom",
              source: "LCMDParcels",
              "source-layer": "tax_parcels_old",
              type: "fill",
              // @ts-expect-error
              paint: oldLayerStyles,
              layout: {
                visibility: "none",
              },
            },
            {
              id: "public_land",
              source: "LCMDParcels",
              slot: "bottom",
              "source-layer": "public_land",
              type: "fill",
              // @ts-expect-error
              paint: publicLandStyles,
            },
            {
              id: "Eastside_Reroutes",
              source: "LCMDParcels",
              "source-layer": "eastside_reroutes",
              type: "line",
              paint: {
                "line-color": [
                  "case",
                  ["boolean", ["feature-state", "selected"], false],
                  "#48c242",
                  "#594630",
                ],
                "line-width": getLineWidth({ unselectedSize: -30 }),
              },
            },
          ],
          _map
        );
        setSelectionlayers(selectedLayers);
        setHighlightLayers(highlightedLayers);
        setLayers([
          "Eastside_Reroutes",
          "tax_parcels",
          "public_land",
          "tax_parcels_old",
        ]);
        addHillShade(_map);

        // Events

        _map.on("click", onClick);
      });
    }
  }, [mapContainer, map, onClick, onMapRender]);

  return {
    map,
    mapContainer,
    mapContainerRef,
    mapInitialized,
    selectionLayers,
    highlightLayers,
    layers,
  };
};

const addHillShade = (map: Map) => {
  map.addSource("mapbox-dem-hillshade", {
    type: "raster-dem",
    url: "mapbox://mapbox.mapbox-terrain-dem-v1",
    maxzoom: 13,
  });
  map.addSource("mapbox-dem", {
    type: "raster-dem",
    url: "mapbox://mapbox.mapbox-terrain-dem-v1",
    maxzoom: 13,
  });
  map.addLayer({
    id: "hillshading",
    source: "mapbox-dem-hillshade",
    type: "hillshade",
    paint: {
      "hillshade-exaggeration": 0.2,
    },
  });
  map.setTerrain({ source: "mapbox-dem", exaggeration: 2.5 });
};

const addSelectableLayers = (layers: mapboxgl.AnyLayer[], map: Map) => {
  const layerResults = layers.map((layer) =>
    addSelectableLayer({
      layer,
      map,
      order: layer.type === "line" ? "below" : "above",
    })
  );
  return layerResults.reduce(
    (result, { highlightedLayer, selectedLayer }) => {
      return {
        highlightedLayers: [...result.highlightedLayers, highlightedLayer],
        selectedLayers: [...result.selectedLayers, selectedLayer],
      };
    },
    { highlightedLayers: [], selectedLayers: [] } as {
      highlightedLayers: string[];
      selectedLayers: string[];
    }
  );
};

const addSelectableLayer = ({
  layer,
  map,
  order = "above",
}: {
  layer: mapboxgl.AnyLayer;
  map: Map;
  order?: "above" | "below";
}) => {
  if (order === "above") {
    map.addLayer(layer);
  }
  if (layer.type === "fill" || layer.type === "line") {
    const { paint, layout, ...unstyledLayer } = layer;
    map.addLayer({
      ...unstyledLayer,
      type: "line",
      id: getSelectedLayer(layer.id),
      ...(layer.type === "fill" ? SELECTED_FILL_STYLE : SELECTED_LINE_STYLE),
    });
    map.addLayer({
      ...unstyledLayer,
      type: "line",
      id: getHighlightLayer(layer.id),
      ...(layer.type === "fill"
        ? HIGHLIGHTED_FILL_STYLE
        : HIGHLIGHTED_LINE_STYLE),
    });
  }
  if (order === "below") {
    map.addLayer(layer);
  }
  return {
    highlightedLayer: `${layer.id}_highlighted`,
    selectedLayer: `${layer.id}_selected`,
  };
};
