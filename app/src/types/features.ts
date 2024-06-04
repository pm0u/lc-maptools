import { MapboxPolygonFeature } from "@/types/mapbox";
import {
  PUBLIC_LAND_PROPERTIES,
  TAX_PARCEL_PROPERTIES,
} from "../../../data/src/constants";
import { MapboxGeoJSONFeature } from "mapbox-gl";
import {
  AvailableLCMDProperties,
  AvailablePublicLandProperties,
} from "../../../data/types/properties";

export type LCMDParcel = Omit<MapboxPolygonFeature, "properties"> & {
  properties: {
    [key in (typeof TAX_PARCEL_PROPERTIES)[number]]: AvailableLCMDProperties[key];
  };
};

export type PublicParcel = Omit<MapboxPolygonFeature, "properties"> & {
  properties: {
    [key in (typeof PUBLIC_LAND_PROPERTIES)[number]]: AvailablePublicLandProperties[key];
  };
};

export type LakeCountyFeature = LCMDParcel | PublicParcel;

export const isLCMDParcel = (
  feature: MapboxGeoJSONFeature
): feature is LCMDParcel => {
  return (
    feature.sourceLayer === "tax_parcels" ||
    feature.sourceLayer === "tax_parcels_old"
  );
};

export const isPublicLandParcel = (
  feature: MapboxGeoJSONFeature
): feature is PublicParcel => {
  return feature.sourceLayer === "public_land";
};
