import {
  AvailableLCMDProperties,
  AvailablePublicLandProperties,
} from "../types/properties";

export const LCMD_QUERY_ENDPOINT =
  "https://services1.arcgis.com/38PTfoP8IjlBsxZN/arcgis/rest/services/LCMDParcelInfo/FeatureServer/0/query";

export const LCPL_QUERY_ENDPOINT =
  "https://services1.arcgis.com/38PTfoP8IjlBsxZN/arcgis/rest/services/Federal_Lands_ALL_Lake/FeatureServer/0/query";

export const TAX_PARCEL_PROPERTIES = [
  "ACRES",
  "ACTUAL_VAL",
  "ADDRESS1",
  "ADDRESS2",
  "AREAID",
  "ASSESSED_V",
  "CITY",
  "LEGAL_1",
  "LEGAL",
  "MILL_LEVY",
  "NAME",
  "STREETNAME",
  "STREETNO",
  "ZIPCODE",
] as const satisfies (keyof AvailableLCMDProperties)[];

export const PUBLIC_LAND_PROPERTIES = [
  "adm_manage",
  "GIS_acres",
] as const satisfies (keyof AvailablePublicLandProperties)[];
