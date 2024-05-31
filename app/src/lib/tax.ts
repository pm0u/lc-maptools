import { LCMDParcel } from "@/types/features";
import { AreaId } from "../../../data/types/properties";

type AreaDef = {
  name: string;
  id: AreaId;
  millLevy: number;
};

export const lcTaxAreas: AreaDef[] = [
  {
    id: 191,
    name: "Lake County",
    millLevy: 0.089142,
  },
  {
    id: 112,
    name: "City of Leadville",
    millLevy: 0.11011,
  },
  {
    id: 114,
    name: "City of Leadville",
    millLevy: 0.11011,
  },
  {
    id: 193,
    name: "County with water & sewer",
    millLevy: 0.09121,
  },
  {
    id: 195,
    name: "Sylvan Lakes",
    millLevy: 0.106287,
  },
  {
    id: 196,
    name: "County with water",
    millLevy: 0.089142,
  },
  {
    id: 197,
    name: "Climax",
    millLevy: 0.079922,
  },
  {
    id: 198,
    name: "Brooklyn Heights",
    millLevy: 0.11511,
  },
  {
    id: 199,
    name: "Mountain View Heights",
    millLevy: 0.139142,
  },
  {
    id: 189,
    name: "Pan Ark",
    millLevy: 0.101512,
  },
];

/** Mill levy lookup by area ID */
export const millLevy = lcTaxAreas.reduce((levies, area) => {
  return {
    ...levies,
    [area.id]: area.millLevy,
  };
}, {} as Record<AreaId, number>);

export const getCountyTaxes = (feature: LCMDParcel) => {
  return feature.properties.ASSESSED_V * millLevy[feature.properties.AREAID];
};

export const getFormattedCountyTaxes = (feature: LCMDParcel) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(getCountyTaxes(feature));
};
