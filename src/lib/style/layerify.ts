import tinycolor from "tinycolor2";
import { selectColor } from "@/lib/color";
import mapboxgl from "mapbox-gl";

export const layerifyByName = (names: Array<{ name: string; id: number }>) => {
  const colors = names.reduce(
    (properties, { name, id }) => {
      const color = selectColor(id);
      return {
        ...properties,
        "fill-color": [...properties["fill-color"], name, color],
        "fill-outline-color": [
          ...properties["fill-outline-color"],
          name,
          tinycolor(color).darken(15).toHexString(),
        ],
      };
    },
    {
      "fill-color": ["match", ["get", "name"]],
      "fill-outline-color": ["match", ["get", "name"]],
      "fill-opacity": 0.4,
    }
  );
  return {
    ...colors,
    "fill-color": [...colors["fill-color"], "#d2d2d2"],
    "fill-outline-color": [...colors["fill-outline-color"], "#d2d2d2"],
  } as Partial<mapboxgl.FillPaint>;
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
