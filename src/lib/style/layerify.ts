import tinycolor from "tinycolor2";
import { selectColor } from "@/lib/color";
import mapboxgl from "mapbox-gl";
import { BsFillCollectionFill } from "react-icons/bs";
import { PublicLandAgency } from "@/types/properties";

const percentToHex = (p: number) => {
  return `0${Math.round((255 / 100) * p).toString(16)}`.slice(-2).toUpperCase();
};

export const getColorProperties = (id: number, opacity = 100) => ({
  fillColor: `${selectColor(id)}${
    percentToHex(opacity) === "FF" ? "" : percentToHex(opacity)
  }`,
  fillOutlineColor: tinycolor(selectColor(id)).darken(15).toHexString(),
});

export const layerifyByName = (names: Array<{ name: string; id: number }>) => {
  const colors = names.reduce(
    (properties, { name, id }) => {
      const { fillColor, fillOutlineColor } = getColorProperties(id);
      return {
        ...properties,
        "fill-color": [...properties["fill-color"], name, fillColor],
        "fill-outline-color": [
          ...properties["fill-outline-color"],
          name,
          fillOutlineColor,
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

const publicLandColors: Record<PublicLandAgency, string> = {
  USFS: "#63c73e",
  BLM: "#c99739",
  USFW: "#54cca8",
};

export const getPublicLandColorProperties = (
  agency: PublicLandAgency,
  opacity = 100
) => {
  return {
    fillColor: `${publicLandColors[agency]}${
      opacity === 100 ? "" : percentToHex(opacity)
    }`,
    fillOutlineColor: tinycolor(publicLandColors[agency])
      .darken(15)
      .toHexString(),
  };
};

export const layerifyPublicLand = () => {
  const fillOutlines = Object.fromEntries(
    Object.entries(publicLandColors).map(([k, v]) => [
      k,
      tinycolor(v).darken(15).toHexString(),
    ])
  );

  return {
    "fill-color": [
      "match",
      ["get", "adm_manage"],
      ...Object.entries(publicLandColors).flat(),
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
