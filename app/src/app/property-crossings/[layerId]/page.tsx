"use client";

import { useDataLayers } from "@/contexts/data-layers";
import { useParams } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
  const { zoomToFeature } = useDataLayers();
  const params = useParams<{ layerId: string }>();

  useEffect(() => {
    zoomToFeature(params.layerId);
  }, [zoomToFeature, params.layerId]);

  return <></>;
};

export default Page;
