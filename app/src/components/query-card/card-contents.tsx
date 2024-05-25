"use client";

import { useMapboxMapContext } from "@/components/mapbox/context";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export const CardContents = () => {
  const { lngLat } = useParams<{ lngLat: string }>();
  const { queryLngLat } = useMapboxMapContext();
  useEffect(() => {
    const [lng, lat] = decodeURIComponent(lngLat).split(",");
    const features = queryLngLat([parseFloat(lng), parseFloat(lat)]);
    console.log(features);
  }, [lngLat, queryLngLat]);
  return <div>{lngLat}</div>;
};
