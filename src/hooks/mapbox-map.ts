import { useState, useEffect } from "react";
import { Expression, Map } from "mapbox-gl";
import layerStyles from "~/generated/tax_parcel-layer-styles.json";
import publicLandStyles from "~/generated/public_land-layer-styles.json";

export const useMapboxMap = () => {
  const [map, setMap] = useState<Map>();
  const [mapContainer, mapContainerRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (mapContainer) {
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
        _map.addSource("land", {
          type: "vector",
          tiles: [
            `${window.location.protocol}${window.location.host}/tiles/{z}/{x}/{y}.pbf`,
          ],
        });
        _map.addLayer({
          id: "tax_parcels",
          source: "land",
          "source-layer": "tax_parcels",
          type: "fill",
          paint: layerStyles as {
            "fill-color": Expression;
            "fill-outline-color": Expression;
            "fill-opacity": number;
          },
        });
        _map.addLayer({
          id: "public_land",
          source: "land",
          "source-layer": "public_land",
          type: "fill",
          paint: publicLandStyles as {
            "fill-color": Expression;
            "fill-outline-color": Expression;
            "fill-opacity": number;
          },
        });
        _map.on("click", (e) => {
          const bbox = [
            [e.point.x - 5, e.point.y - 5],
            [e.point.x + 5, e.point.y + 5],
          ] as [[number, number], [number, number]];
          // Find features intersecting the bounding box.
          const selectedFeatures = _map.queryRenderedFeatures(bbox, {
            layers: ["tax_parcels", "public_land"],
          });
          console.log({ selectedFeatures });
        });
      });
    }
  }, [mapContainer]);

  return {
    map,
    mapContainer,
    mapContainerRef,
  };
};
