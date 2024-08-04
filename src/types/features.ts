import { MapboxPolygonFeature } from "@/types/mapbox";
import { MapboxGeoJSONFeature } from "mapbox-gl";
import {
  AvailableCountyZoningProperties,
  AvailableLCMDProperties,
  AvailablePublicLandProperties,
} from "./properties";

export const TAX_PARCEL_PROPERTIES = [
  "acres",
  "accttype",
  "accountno",
  "actual_val",
  "address1",
  "address2",
  "areaid",
  "assessed_v",
  "city",
  "legal_1",
  "legal",
  "mill_levy",
  "name",
  "parcelnb",
  "streetname",
  "streetno",
  "zipcode",
] as const satisfies (keyof AvailableLCMDProperties)[];

export const PUBLIC_LAND_PROPERTIES = [
  "adm_manage",
  "gis_acres",
] as const satisfies (keyof AvailablePublicLandProperties)[];

export const COUNTY_ZONING_PROPERTIES = [
  "id",
  "fid",
  "layer",
] as const satisfies (keyof AvailableCountyZoningProperties)[];

export type LCMDParcel = Omit<MapboxPolygonFeature, "properties"> & {
  id: number;
  properties: {
    [key in (typeof TAX_PARCEL_PROPERTIES)[number]]: AvailableLCMDProperties[key];
  };
};

export type PublicParcel = Omit<MapboxPolygonFeature, "properties"> & {
  id: number;
  properties: {
    [key in (typeof PUBLIC_LAND_PROPERTIES)[number]]: AvailablePublicLandProperties[key];
  };
};

export type LakeCountyFeature = LCMDParcel | PublicParcel;

export const isLCMDParcel = (
  feature: MapboxGeoJSONFeature
): feature is LCMDParcel => {
  return feature.sourceLayer === "tax_parcels";
};

export const isPublicLandParcel = (
  feature: MapboxGeoJSONFeature
): feature is PublicParcel => {
  return feature.sourceLayer === "public_land";
};
