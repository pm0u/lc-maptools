import { useState, useEffect, useCallback } from "react";
import mapboxgl, { Map, MapEventType } from "mapbox-gl";
import { useRouterWithHash } from "@/hooks/use-router-with-hash";
import { mapboxToken } from "@/env";

export const LAND_LAYERS = ["tax_parcels", "public_land", "tax_parcels_old"];

let isInitialized = false;

export const useMapboxMap = () => {
  const [map, setMap] = useState<Map>();
  const [mapInitialized, setMapInitialized] = useState(false);
  const [mapContainer, mapContainerRef] = useState<HTMLDivElement | null>(null);
  const router = useRouterWithHash();
  const [layers, setLayers] = useState<string[]>([]);

  const onMapRender = useCallback((e: MapEventType["render"]) => {
    const { target: map } = e;
    if (map.areTilesLoaded() && map.isStyleLoaded()) {
      setMapInitialized(true);
      map.off("render", onMapRender);
    }
  }, []);

  const onStyleImportLoad = useCallback(
    (e: MapEventType["style.import.load"]) => {
      const { target: map } = e;
      addHillShade(map);
    },
    []
  );

  const onClick = useCallback((e: mapboxgl.MapMouseEvent) => {
    const {
      lngLat: { lng, lat },
    } = e;
    router.push(`/query/${lng},${lat}`);
  }, []);

  useEffect(() => {
    let _map: mapboxgl.Map;
    const initMap = async () => {
      if (mapContainer && !isInitialized) {
        isInitialized = true;
        const style = await fetch("/stylesheet.json").then((res) => res.json());
        _map = new Map({
          accessToken: mapboxToken,
          container: mapContainer,
          hash: true,
          // Leadville
          center: [-106.3335, 39.22324],
          zoom: 10,
          maxZoom: 22,
          style,
        });
        //fetch("/stylesheet.json")
        //  .then((res) => res.json())
        //  .then((style) => {
        //    _map.setStyle(style);
        //  });
        setMap(_map);
        _map.on("render", onMapRender);
        _map.on("click", onClick);
        _map.on("style.import.load", onStyleImportLoad);
      }
    };

    initMap();

    return () => {
      if (_map) {
        isInitialized = false;
        setMapInitialized(false);
        _map.off("render", onMapRender);
        _map.off("style.import.load", onStyleImportLoad);
        _map.off("click", onClick);
        _map.remove();
      }
    };
  }, [mapContainer, onClick, onMapRender]);

  return {
    map,
    mapContainer,
    mapContainerRef,
    mapInitialized,
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
  map.setTerrain({ source: "mapbox-dem", exaggeration: 1.9 });
};
