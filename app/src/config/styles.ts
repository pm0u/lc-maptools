import { Expression, LineLayout, LinePaint } from "mapbox-gl";

const SELECTED_FILL_COLOR = "#8c0327";
const SELECTED_LINE_COLOR = "#8c0327";
const HIGHLIGHTED_FILL_COLOR = "#e5dfe1";
const HIGHLIGHTED_LINE_COLOR = "#e5dfe1";

export const getLineWidth = ({
  selectedSize = 1,
  unselectedSize = 1,
  selectable = false,
}:
  | {
      selectedSize?: number;
      unselectedSize?: number;
      selectable?: true;
    }
  | {
      selectable?: false;
      unselectedSize?: number;
      selectedSize?: never;
    }): Expression => [
  "interpolate",
  ["exponential", 2],
  ["zoom"],
  10,
  selectable
    ? [
        "case",
        ["boolean", ["feature-state", "selected"], false],
        ["^", 2, 3 * (1 + selectedSize / 100)],
        ["^", 2, 1.5 * (1 + unselectedSize / 100)],
      ]
    : ["^", 2, 1.5 * (1 + unselectedSize / 100)],
  18,
  selectable
    ? [
        "case",
        ["boolean", ["feature-state", "selected"], false],
        ["^", 2, 6 * (1 + selectedSize / 100)],
        ["^", 2, 5 * (1 + unselectedSize / 100)],
      ]
    : ["^", 2, 5 * (1 + unselectedSize / 100)],
];

export const SELECTED_FILL_STYLE: { paint: LinePaint } = {
  paint: {
    "line-width": getLineWidth({ selectedSize: -60, selectable: true }),
    "line-color": [
      "case",
      ["boolean", ["feature-state", "selected"], false],
      SELECTED_FILL_COLOR,
      "transparent",
    ],
  },
};

export const SELECTED_LINE_STYLE: { paint: LinePaint; layout: LineLayout } = {
  layout: {
    "line-cap": "round",
    "line-join": "round",
  },
  paint: {
    "line-blur": ["interpolate", ["exponential", 2], ["zoom"], 10, 5, 18, 15],
    "line-width": getLineWidth({
      selectedSize: 4,
      unselectedSize: 8,
      selectable: true,
    }),
    "line-color": [
      "case",
      ["boolean", ["feature-state", "selected"], false],
      SELECTED_LINE_COLOR,
      "transparent",
    ],
  },
};

export const HIGHLIGHTED_FILL_STYLE: { paint: LinePaint } = {
  paint: {
    "line-width": 3,
    "line-color": [
      "case",
      ["boolean", ["feature-state", "highlighted"], false],
      HIGHLIGHTED_FILL_COLOR,
      "transparent",
    ],
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
      "line-color": [
        "case",
        ["boolean", ["feature-state", "highlighted"], false],
        HIGHLIGHTED_LINE_COLOR,
        "transparent",
      ],
    },
  };
