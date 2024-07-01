import type { Layer } from "mapbox-gl";

export type MapboxProperties = {
  layer: Layer;
  source: string;
  sourceLayer: string;
  state: { [key: string]: any };
};

export type MapboxFeature<Geo extends GeoJSON.Geometry> = MapboxProperties &
  GeoJSON.Feature<Geo>;

export type MapboxLineFeature =
  | MapboxFeature<GeoJSON.LineString>
  | MapboxFeature<GeoJSON.MultiLineString>;

export type MapboxPolygonFeature =
  | MapboxFeature<GeoJSON.Polygon>
  | MapboxFeature<GeoJSON.MultiPolygon>;

export type BBoxXY = [number, number, number, number];

export const isPolygonFeature = (obj: object): obj is MapboxPolygonFeature => {
  return (
    "geometry" in obj &&
    typeof obj.geometry === "object" &&
    obj.geometry !== null &&
    "type" in obj.geometry &&
    (obj.geometry.type === "Polygon" || obj.geometry.type === "MultiPolygon")
  );
};
