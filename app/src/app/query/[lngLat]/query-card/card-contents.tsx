"use client";

import { useMapboxMapContext } from "@/components/mapbox/mapbox-map-context";
import { Features } from "@/app/query/[lngLat]/query-card/features";
import { MapboxGeoJSONFeature } from "mapbox-gl";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader } from "@/app/query/[lngLat]/query-card/loader";

export const CardContents = () => {
  const { lngLat } = useParams<{ lngLat: string }>();
  const { queryLngLat, mapInitialized, clearSelectedFeatures } =
    useMapboxMapContext();
  const [features, setFeatures] = useState<MapboxGeoJSONFeature[] | null>(null);

  useEffect(() => {
    if (mapInitialized) {
      const [lng, lat] = decodeURIComponent(lngLat).split(",");
      setFeatures(queryLngLat([parseFloat(lng), parseFloat(lat)]));
    }
  }, [lngLat, queryLngLat, mapInitialized]);

  useEffect(
    () => () => {
      clearSelectedFeatures();
    },
    [clearSelectedFeatures]
  );

  if (!mapInitialized) {
    return (
      <div className="flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return features?.length ? (
    <Features features={features} />
  ) : (
    <div className="text-center font-bold">No features found</div>
  );
};
