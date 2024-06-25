import { useState, useEffect, useCallback } from "react";
import mapboxgl, { Map, MapEventType } from "mapbox-gl";
import { useRouterWithHash } from "@/hooks/use-router-with-hash";
import { mapboxToken } from "@/env";

export const LAND_LAYERS = ["tax_parcels", "public_land", "tax_parcels_old"];

export const useMapboxMap = () => {
  const [map, setMap] = useState<Map>();
  const [mapInitialized, setMapInitialized] = useState(false);
  const [mapContainer, mapContainerRef] = useState<HTMLDivElement | null>(null);
  const router = useRouterWithHash();
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

        // Layers
        setLayers([
          "Eastside_Reroutes",
          "tax_parcels",
          "public_land",
          "tax_parcels_old",
        ]);
        // May need to setTerrrain ?

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
    layers,
  };
};
