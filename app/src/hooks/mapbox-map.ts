import { useState, useEffect, useCallback } from "react";
import mapboxgl, { Map, MapEventType } from "mapbox-gl";
import layerStyles from "~data/generated/tax_parcel-layer-styles.json";
import publicLandStyles from "~data/generated/public_land-layer-styles.json";
import SterlingsRamblings from "@/static/Eastside_Reroutes.json";
import { useRouterWithHash } from "@/hooks/use-router-with-hash";
import { mapboxToken, tileDomain } from "@/env";

export const useMapboxMap = () => {
  const [map, setMap] = useState<Map>();
  const [mapInitialized, setMapInitialized] = useState(false);
  const [mapContainer, mapContainerRef] = useState<HTMLDivElement | null>(null);
  const router = useRouterWithHash();

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
      });
      setMap(_map);
      _map.on("load", () => {
        _map.on("render", onMapRender);
        _map.addSource("EastsideReroutes", {
          type: "geojson",
          data: SterlingsRamblings as GeoJSON.FeatureCollection,
        });
        _map.addLayer({
          id: "EastsideReroutes",
          source: "EastsideReroutes",
          type: "line",
          paint: {
            "line-color": ["get", "stroke"],
            "line-width": ["get", "stroke-width"],
          },
        });
        _map.addSource("LCMDParcels", {
          type: "vector",
          tiles: [`${tileDomain}/{z}/{x}/{y}.pbf`],
          maxzoom: 16,
        });
        _map.addLayer({
          id: "tax_parcels",
          slot: "bottom",
          source: "LCMDParcels",
          "source-layer": "tax_parcels",
          type: "fill",
          // @ts-expect-error
          paint: layerStyles,
        });
        _map.addLayer({
          id: "public_land",
          source: "LCMDParcels",
          "source-layer": "public_land",
          type: "fill",
          // @ts-expect-error
          paint: publicLandStyles,
        });
        _map.addSource("mapbox-dem-hillshade", {
          type: "raster-dem",
          url: "mapbox://mapbox.mapbox-terrain-dem-v1",
          maxzoom: 13,
        });
        _map.addSource("mapbox-dem", {
          type: "raster-dem",
          url: "mapbox://mapbox.mapbox-terrain-dem-v1",
          maxzoom: 13,
        });
        _map.addLayer({
          id: "hillshading",
          source: "mapbox-dem-hillshade",
          type: "hillshade",
          paint: {
            "hillshade-exaggeration": 0.2,
          },
        });
        _map.setTerrain({ source: "mapbox-dem", exaggeration: 2.5 });
        _map.on("click", onClick);
      });
    }
  }, [mapContainer, map, onClick, onMapRender]);

  return {
    map,
    mapContainer,
    mapContainerRef,
    mapInitialized,
  };
};
