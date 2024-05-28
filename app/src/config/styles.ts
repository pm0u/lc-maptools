import {
  Expression,
  LineLayout,
  LinePaint,
  MapboxGeoJSONFeature,
} from "mapbox-gl";

const layerMatchers = {
  Eastside_Reroutes: ["id"],
  tax_parcels: ["get", "FID"],
  public_land: ["get", "FID"],
};

const getValue = (
  feature: MapboxGeoJSONFeature,
  matcher: string[]
): string | undefined => {
  if (matcher.length === 1 && matcher[0] in feature) {
    return feature[matcher[0] as keyof typeof feature] as string | undefined;
  }
  if (
    matcher.length > 1 &&
    matcher[matcher.length - 1] in (feature.properties ?? {})
  )
    return feature.properties?.[matcher[matcher.length - 1]];
};

export const getSelectedPaintProperties = (feature: MapboxGeoJSONFeature) => {
  const matcher =
    layerMatchers[
      (feature.sourceLayer ?? feature.source) as keyof typeof layerMatchers
    ];

  if (!matcher) {
    console.error("No identifier designated for layer", feature);
    throw Error(`No identifier designated for layer ${feature.sourceLayer}`);
  }

  const value = getValue(feature, matcher);

  if (!value) {
    console.error("No identifying property on feature", feature);
    throw Error(`No identifying property on feature`);
  }

  if (
    feature.geometry.type === "LineString" ||
    feature.geometry.type === "MultiLineString"
  ) {
    return getSelectedLinePaintProperty(matcher, value);
  }
  if (
    feature.geometry.type === "Polygon" ||
    feature.geometry.type === "MultiPolygon"
  ) {
    return getSelectedFillPaintProperty(matcher, value);
  }
  throw Error(`Unknown geometry type ${feature.geometry.type}`);
};

export const getSelectedFillPaintProperty = (
  matcher: any[],
  value: string
): ["line-color", Expression] => {
  return [
    "line-color",
    ["match", matcher, value, SELECTED_FILL_COLOR, "transparent"],
  ];
};

export const getSelectedLinePaintProperty = (
  matcher: any[],
  value: string
): ["line-color", Expression] => {
  return [
    "line-color",
    ["match", matcher, value, SELECTED_LINE_COLOR, "transparent"],
  ];
};

export const getHighlightedFillPaintProperty = (
  matcher: any[],
  value: string
): ["line-color", Expression] => {
  return [
    "line-color",
    ["match", matcher, value, HIGHLIGHTED_FILL_COLOR, "transparent"],
  ];
};

export const getHighlightedLinePaintProperty = (
  matcher: any[],
  value: string
): ["line-color", Expression] => {
  return [
    "line-color",
    ["match", matcher, value, HIGHLIGHTED_LINE_COLOR, "transparent"],
  ];
};

const SELECTED_FILL_COLOR = "#8c0327";
const SELECTED_LINE_COLOR = "#8c0327";
const HIGHLIGHTED_FILL_COLOR = "#e5dfe1";
const HIGHLIGHTED_LINE_COLOR = "#e5dfe1";

export const SELECTED_FILL_STYLE: { paint: LinePaint } = {
  paint: {
    "line-width": [
      "interpolate",
      ["exponential", 2],
      ["zoom"],
      10,
      ["^", 2, 2],
      24,
      ["^", 2, 3],
    ],
    "line-color": "transparent",
  },
};

export const SELECTED_LINE_STYLE: { paint: LinePaint; layout: LineLayout } = {
  layout: {
    "line-cap": "round",
    "line-join": "round",
  },
  paint: {
    "line-blur": ["interpolate", ["exponential", 2], ["zoom"], 10, 2, 24, 12],
    "line-width": [
      "interpolate",
      ["exponential", 2],
      ["zoom"],
      10,
      ["^", 2, 3],
      24,
      ["^", 2, 10],
    ],
    "line-color": "transparent",
  },
};

export const HIGHLIGHTED_FILL_STYLE: { paint: LinePaint } = {
  paint: {
    "line-width": 3,
    "line-color": "transparent",
  },
};

export const HIGHLIGHTED_LINE_STYLE: { paint: LinePaint; layout: LineLayout } =
  {
    layout: {
      "line-cap": "round",
    },
    paint: {
      "line-blur": 0.5,
      "line-opacity": 0.5,
      "line-color": "transparent",
    },
  };
