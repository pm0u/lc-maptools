import {
  HIGHLIGHTED_FILL_STYLE,
  HIGHLIGHTED_LINE_STYLE,
  SELECTED_FILL_STYLE,
  SELECTED_LINE_STYLE,
  getLineWidth,
} from "@/config/styles";
import { getHighlightLayer, getSelectedLayer } from "@/lib/layers";
import { getPrivateLandNames } from "@/lib/style/data";
import { layerifyByName, layerifyPublicLand } from "@/lib/style/layerify";

export const createSelectableLayer = ({
  layer,
  order = "above",
}: {
  layer: mapboxgl.AnyLayer;
  order?: "above" | "below";
}) => {
  const layers = [];
  if (order === "above") {
    layers.push(layer);
  }
  if (layer.type === "fill" || layer.type === "line") {
    const { paint, layout, ...unstyledLayer } = layer;
    layers.push({
      ...unstyledLayer,
      type: "line",
      id: getSelectedLayer(layer.id),
      ...(layer.type === "fill" ? SELECTED_FILL_STYLE : SELECTED_LINE_STYLE),
    });
    layers.push({
      ...unstyledLayer,
      type: "line",
      id: getHighlightLayer(layer.id),
      ...(layer.type === "fill"
        ? HIGHLIGHTED_FILL_STYLE
        : HIGHLIGHTED_LINE_STYLE),
    });
  }
  if (order === "below") {
    layers.push(layer);
  }
  return layers;
};

export const createSelectableLayers = (layers: mapboxgl.AnyLayer[]) => {
  const layerResults = layers.map((layer) =>
    createSelectableLayer({
      layer,
      order: layer.type === "line" ? "below" : "above",
    })
  );
  return layerResults.flat();
};

export const getLCMDLayers = async () => {
  const parcelNames = await getPrivateLandNames();
  const parcelStyles = layerifyByName(parcelNames);

  return createSelectableLayers([
    {
      id: "tax_parcels",
      // @ts-expect-error
      slot: "bottom",
      source: "LCMDParcels",
      "source-layer": "tax_parcels",
      type: "fill",
      paint: parcelStyles,
    },
    {
      id: "public_land",
      source: "LCMDParcels",
      slot: "bottom",
      "source-layer": "public_land",
      type: "fill",
      // @ts-expect-error
      paint: layerifyPublicLand(),
    },
    {
      id: "eastside_reroutes",
      source: "LCMDParcels",
      "source-layer": "eastside_reroutes",
      type: "line",
      paint: {
        "line-color": [
          "case",
          ["boolean", ["feature-state", "selected"], false],
          "#48c242",
          "#594630",
        ],
        "line-width": getLineWidth({ unselectedSize: -30 }),
      },
    },
  ]);
};
