import { Expression } from "mapbox-gl";
import tinycolor from "tinycolor2";
import { selectColor } from "@/lib/color";

export const layerifyByName = (names: string[]) => {
  const colors = names.reduce(
    (obj, name, i) => {
      if (name in obj) return obj;
      const color = obj.fillColor[name] ?? selectColor(i);
      return {
        fillColor: {
          ...obj.fillColor,
          [name]: color,
        },
        fillOutlineColor: {
          ...obj.fillOutlineColor,
          [name]: tinycolor(color).darken(15).toHexString(),
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
      ["get", "name"],
      ...Object.entries(colors.fillColor).flat(),
      "#d2d2d2",
    ] satisfies Expression,
    "fill-outline-color": [
      "match",
      ["get", "name"],
      ...Object.entries(colors.fillOutlineColor).flat(),
      "#d2d2d2",
    ] satisfies Expression,
    "fill-opacity": 0.4,
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
      tinycolor(v).darken(15).toHexString(),
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
