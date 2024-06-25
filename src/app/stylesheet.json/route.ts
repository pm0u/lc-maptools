import type { Style } from "mapbox-gl";
import { TILE_DATA_CDN_CACHE, TILE_DATA_CLIENT_CACHE } from "@/config/cache";

export async function GET(req: Request) {
  const style: Style = {
    version: 1,
    sources: {
      "mapbox-dem-hillshade": {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        maxzoom: 13,
      },
      "mapbox-dem": {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        maxzoom: 13,
      },
      LCMDParcels: {
        type: "vector",
        tiles: [`${req.headers.get("host")}/tiles/{z}/{x}/{y}`],
      },
    },
    layers: [
      {
        id: "hillshading",
        source: "mapbox-dem-hillshade",
        type: "hillshade",
        paint: {
          "hillshade-exaggeration": 2.5,
        },
      },
    ],
  };

  const res = new Response(JSON.stringify(style), {
    headers: {
      "Content-Type": "application/json",
      "s-max-age": TILE_DATA_CDN_CACHE.toString(),
      "max-age": TILE_DATA_CLIENT_CACHE.toString(),
    },
  });

  return res;
}

const createSelectableLayers = ({
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
  return {
    layers,
    highlightedLayer: `${layer.id}_highlighted`,
    selectedLayer: `${layer.id}_selected`,
  };
};
