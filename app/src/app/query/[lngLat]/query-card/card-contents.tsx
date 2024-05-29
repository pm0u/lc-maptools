"use client";

import { useMapboxMapContext } from "@/components/mapbox/context";
import { Features } from "@/app/query/[lngLat]/query-card/features";
import { MapboxGeoJSONFeature } from "mapbox-gl";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader } from "@/app/query/[lngLat]/query-card/loader";
import uniqBy from "lodash/uniqBy";

export const CardContents = () => {
  const { lngLat } = useParams<{ lngLat: string }>();
  const { queryLngLat, mapInitialized, clearSelectedFeatures } =
    useMapboxMapContext();
  const [features, setFeatures] = useState<MapboxGeoJSONFeature[] | null>(null);

  useEffect(() => {
    if (mapInitialized) {
      const [lng, lat] = decodeURIComponent(lngLat).split(",");
      const queriedFeatures = queryLngLat([parseFloat(lng), parseFloat(lat)]);
      const deduped = uniqBy(queriedFeatures, (feature) => feature.id);
      setFeatures(deduped);
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
