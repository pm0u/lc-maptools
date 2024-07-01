import { MapboxGeoJSONFeature } from "mapbox-gl";
import { AreaId, areaIds } from "../types/properties";
import { MapboxPolygonFeature } from "@/types/mapbox";

const countyPropertyOwnerNames = ["BOARD OF COUNTY COMMISSIONERS"];

type AreaDef = {
  name: string;
  id: AreaId;
  millLevy: number;
};

export type TaxCalculableFeature = MapboxPolygonFeature & {
  properties: {
    ASSESSED_V: number;
    AREAID: AreaId;
    CUR_TAX?: number;
  };
};

export const isTaxCalculableFeature = <T extends object>(
  item: T
): item is TaxCalculableFeature & T => {
  return (
    "properties" in item &&
    typeof item.properties === "object" &&
    item.properties !== null &&
    "AREAID" in item.properties &&
    typeof item.properties.AREAID === "number" &&
    areaIds.includes(item.properties.AREAID as AreaId) &&
    "ASSESSED_V" in item.properties &&
    typeof item.properties.ASSESSED_V === "number"
  );
};

export const isCountyProperty = (feature: MapboxGeoJSONFeature) => {
  return countyPropertyOwnerNames.includes(feature.properties?.NAME?.trim());
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

export const getFormattedCountyTaxesForFeatures = (
  features: TaxCalculableFeature[]
) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(getCountyTaxesForFeatures(features));
};

export const getCountyTaxesForFeatures = (features: TaxCalculableFeature[]) => {
  return features.reduce(
    (total, feature) => total + getCountyTaxes(feature),
    0
  );
};

export const getCountyTaxes = (feature: TaxCalculableFeature) => {
  if (
    "CUR_TAX" in feature.properties &&
    typeof feature.properties.CUR_TAX === "number"
  ) {
    return feature.properties.CUR_TAX;
  }
  return feature.properties.ASSESSED_V * millLevy[feature.properties.AREAID];
};

export const getFormattedCountyTaxes = (feature: TaxCalculableFeature) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(getCountyTaxes(feature));
};
