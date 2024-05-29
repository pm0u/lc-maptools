import { ArcGISResponse } from "@/types/geo-json";
import { Expression } from "mapbox-gl";
import tinycolor from "tinycolor2";

function HSLToHex(h: number, s: number, l: number) {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0"); // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

const selectColor = (number: number): string => {
  const hue = number * 137.508; // use golden angle approximation
  return HSLToHex(hue, 50, 50);
};

export const layerifyByOwner = (geoJson: ArcGISResponse) => {
  const colors = geoJson.features.reduce(
    (obj, feature, i) => {
      if (feature.properties.NAME in obj) return obj;
      const color = obj.fillColor[feature.properties.NAME] ?? selectColor(i);
      return {
        fillColor: {
          ...obj.fillColor,
          [feature.properties.NAME]: color,
        },
        fillOutlineColor: {
          ...obj.fillOutlineColor,
          [feature.properties.NAME]: tinycolor(color).darken().toHexString(),
        },
      };
    },
    { fillColor: {}, fillOutlineColor: {} } as {
      fillColor: Record<string, string>;
      fillOutlineColor: Record<string, string>;
    }
  );
  return toColorFilter(colors);
};

export const toColorFilter = (colors: {
  fillColor: Record<string, string>;
  fillOutlineColor: Record<string, string>;
}) => {
  return {
    "fill-color": [
      "match",
      ["get", "NAME"],
      ...Object.entries(colors.fillColor).flat(),
      "#d2d2d2",
    ] satisfies Expression,
    "fill-outline-color": [
      "match",
      ["get", "NAME"],
      ...Object.entries(colors.fillOutlineColor).flat(),
      "#d2d2d2",
    ] satisfies Expression,
    "fill-opacity": 0.6,
  };
};

export const layerifyPublicLand = () => {
  const fillColors = {
    USFS: "#63c73e",
    BLM: "#c99739",
    USFW: "#54cca8",
  };

  const fillOutlines = Object.fromEntries(
    Object.entries(fillColors).map(([k, v]) => [
      k,
      tinycolor(v).darken().toHexString(),
    ])
  );

  return {
    "fill-color": [
      "match",
      ["get", "adm_manage"],
      ...Object.entries(fillColors).flat(),
      "#d2d2d2",
    ],
    "fill-outline-color": [
      "match",
      ["get", "adm_manage"],
      ...Object.entries(fillOutlines).flat(),
      "#d2d2d2",
    ],
    "fill-opacity": 0.4,
  };
};
