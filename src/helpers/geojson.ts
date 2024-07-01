import { MapboxFeature, MapboxLineFeature } from "@/types/mapbox";
import type { MapboxGeoJSONFeature } from "mapbox-gl";

export const isLine = (
  feature: MapboxGeoJSONFeature
): feature is MapboxLineFeature =>
  isLineString(feature) || isMultiLineString(feature);

export const isLineString = (
  feature: MapboxGeoJSONFeature
): feature is MapboxFeature<GeoJSON.LineString> =>
  feature.geometry.type === "LineString";

export const isMultiLineString = (
  feature: MapboxGeoJSONFeature
): feature is MapboxFeature<GeoJSON.MultiLineString> =>
  feature.geometry.type === "MultiLineString";
