"use client";

import { useDataLayers } from "@/contexts/data-layers";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
  const { zoomToFeature } = useDataLayers();
  const params = useSearchParams();

  useEffect(() => {
    if (params.get("layerId")) {
      const layerId = params.get("layerId") as string;
      zoomToFeature(layerId);
    }
  }, [zoomToFeature, params]);

  return <></>;
};

export default Page;
