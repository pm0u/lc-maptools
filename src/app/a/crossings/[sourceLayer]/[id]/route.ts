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

    /**
     * Colors here...
     * create an object id: color to reference
     * change API response format like:
     * {
     *   parcels: []
     *   colors: {}
     * }
     */
    const parcels = propertyCrossings.map((c) => c.json);
    //const colors = getColors(parcels);

    return new Response(
      JSON.stringify({
        parcels,
        colors: {},
      }),
      {
        status: 200,
        headers: { "content-type": "application/json" },
      }
    );
  } catch (e) {
    console.error(e);
    return new Response(null, { status: 500 });
  }
}
