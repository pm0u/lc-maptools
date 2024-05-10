import { useState, useEffect } from "react";
import { Map } from "mapbox-gl";
import layerStyles from "~/generated/tax_parcel-layer-styles.json";
import publicLandStyles from "~/generated/public_land-layer-styles.json";

export const useMapboxMap = () => {
  const [map, setMap] = useState<Map>();
  const [mapContainer, mapContainerRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (mapContainer && mapContainer !== map?.getContainer()) {
      if (map) {
        map.remove();
      }
      const _map = new Map({
        accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
        container: mapContainer,
        hash: true,
        center: [-106.3335, 39.22324],
        zoom: 10,
      });
      setMap(_map);
      _map.on("load", () => {
        _map.addSource("LCMDParcels", {
          type: "vector",
          tiles: [
            `${window.location.protocol}${window.location.host}/tiles/{z}/{x}/{y}.pbf`,
          ],
          maxzoom: 16,
        });
        _map.addLayer({
          id: "tax_parcels",
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
        _map.on("click", (e) => {
          const bbox = [
            [e.point.x - 5, e.point.y - 5],
            [e.point.x + 5, e.point.y + 5],
          ] as [[number, number], [number, number]];
          // Find features intersecting the bounding box.
          const selectedFeatures = _map.queryRenderedFeatures(bbox);
          console.log({ selectedFeatures });
        });
      });
    }
  }, [mapContainer, map]);

  return {
    map,
    mapContainer,
    mapContainerRef,
  };
};
