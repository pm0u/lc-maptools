import { LAND_LAYERS, layerDefs } from "@/lib/spatial";
import { crossings } from "@/lib/spatial/crossings";

const DEFAULT_CROSSING_LAYERS = [
  "tax_parcels",
  "public_land",
] as const satisfies Array<keyof typeof layerDefs>;

export async function GET(
  _request: Request,
  {
    params,
    query = {},
  }: {
    params: {
      id: string;
      sourceLayer: keyof typeof layerDefs;
    };
    query: {
      crossingLayers?: Array<(typeof LAND_LAYERS)[number]>;
    };
  }
) {
  try {
    const { id, sourceLayer } = params;
    const { crossingLayers = DEFAULT_CROSSING_LAYERS } = query;

    const propertyCrossings = await crossings({
      id,
      sourceLayer,
      crossingLayers,
    });

    return new Response(JSON.stringify(propertyCrossings), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(null, { status: 500 });
  }
}
