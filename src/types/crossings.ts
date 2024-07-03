import { LakeCountyFeature } from "@/types/features";

export type CrossingsResponse = {
  parcels: LakeCountyFeature[];
  colors: {
    string: {
      fillColor: string;
      fillOutlineColor: string;
    };
  };
};
