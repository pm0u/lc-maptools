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
