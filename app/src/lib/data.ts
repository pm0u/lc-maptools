import { MapboxGeoJSONFeature } from "mapbox-gl";

export const getFeatureName = (feature: MapboxGeoJSONFeature): string => {
  return (
    feature.properties?.name?.trim() ||
    feature.properties?.NAME?.trim() ||
    feature.properties?.description?.trim() ||
    feature.properties?.title?.trim() ||
    feature.properties?.adm_manage?.trim() ||
    "Unknown"
  );
};
