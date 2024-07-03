import { MapboxGeoJSONFeature } from "mapbox-gl";
import { AreaId, areaIds } from "../types/properties";
import { MapboxPolygonFeature } from "@/types/mapbox";

export type TaxCalculableFeature = MapboxPolygonFeature & {
  properties: {
    assessed_v: number;
    areaid: AreaId;
    mill_levy: number;
    accttype: string;
    cur_tax?: number;
  };
};

export const isTaxCalculableFeature = <T extends object>(
  item: T
): item is TaxCalculableFeature & T => {
  return (
    "properties" in item &&
    typeof item.properties === "object" &&
    item.properties !== null &&
    "areaid" in item.properties &&
    typeof item.properties.areaid === "number" &&
    areaIds.includes(item.properties.areaid as AreaId) &&
    "assessed_v" in item.properties &&
    typeof item.properties.assessed_v === "number" &&
    "mill_levy" in item.properties &&
    typeof item.properties.mill_levy === "number" &&
    "accttype" in item.properties &&
    typeof item.properties.accttype === "string"
  );
};

export const isTaxExemptFeature = (feature: MapboxGeoJSONFeature) => {
  return feature.properties?.accttype === "N";
};

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
  if (feature.properties.accttype === "N") return 0;
  return feature.properties.assessed_v * feature.properties.mill_levy * 0.001;
};

export const getFormattedCountyTaxes = (feature: TaxCalculableFeature) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(getCountyTaxes(feature));
};
