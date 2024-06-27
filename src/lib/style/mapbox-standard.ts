import { Style } from "mapbox-gl";

export const extendMapboxStandard = (style: Partial<Style>): Style => {
  return {
    version: 8,
    // @ts-expect-error
    imports: [
      {
        id: "basemap",
        url: "mapbox://styles/mapbox/standard",
        config: {
          "terrain-exaggeration": 1.9,
        },
      },
    ],
    ...style,
  };
};
