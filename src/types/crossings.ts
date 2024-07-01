import { LAND_LAYERS } from "@/lib/spatial";

type CrossedPropertyDesc = {
  name: string;
  id: number;
  sourceLayer: (typeof LAND_LAYERS)[number];
  source: "LCMDParcels";
};

export type CrossedPropertiesResponse = CrossedPropertyDesc[];
