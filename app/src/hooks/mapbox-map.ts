import { useState, useEffect } from "react";
import { Map } from "mapbox-gl";
import layerStyles from "~/generated/tax_parcel-layer-styles.json";
import publicLandStyles from "~/generated/public_land-layer-styles.json";
import SterlingsRamblings from "@/static/Eastside_Reroutes.json";
import { useRouterWithHash } from "@/hooks/use-router-with-hash";

const tileDomain = process.env.NEXT_PUBLIC_TILE_SERVER_DOMAIN;

export const useMapboxMap = () => {
  const [map, setMap] = useState<Map>();
  const [mapContainer, mapContainerRef] = useState<HTMLDivElement | null>(null);
  const router = useRouterWithHash();

  useEffect(() => {
    if (mapContainer && mapContainer !== map?.getContainer()) {
      if (map) {
        map.remove();
      }
      const _map = new Map({
        accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
        container: mapContainer,
        hash: true,
        // Leadville
        center: [-106.3335, 39.22324],
        zoom: 10,
      });
      setMap(_map);
      _map.on("load", () => {
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
        _map.on("click", (e) => {
          const {
            lngLat: { lng, lat },
          } = e;
          // just route to query...
          router.push(`/query/${lng},${lat}`);
          //const bbox = [
          //  [e.point.x - 5, e.point.y - 5],
          //  [e.point.x + 5, e.point.y + 5],
          //] as [[number, number], [number, number]];
          //// Find features intersecting the bounding box.
          //const selectedFeatures = _map.queryRenderedFeatures(bbox);
          //console.log({ selectedFeatures });
        });
      });
    }
  }, [mapContainer, map, router]);

  return {
    map,
    mapContainer,
    mapContainerRef,
  };
};
