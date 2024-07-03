import { LAND_LAYERS, layerDefs } from "@/lib/spatial";
import { crossings } from "@/lib/spatial/crossings";
import { getPrivateLandNames } from "@/lib/style/data";
import {
  getColorProperties,
  getPublicLandColorProperties,
} from "@/lib/style/layerify";
import { isLCMDParcel, isPublicLandParcel } from "@/types/features";

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

    const parcels = propertyCrossings.map((c) => c.json);
    const namesAndIds = await getPrivateLandNames();

    /**
     * This doesn't work bc id <-> color is not 1:1
     * Since we do a select distinct, it's possible this ID is not 1:1 with the id used to create the color for this parcel
     */
    const colors = parcels.reduce((obj, parcel) => {
      if (!parcel.id) return obj;
      if (isLCMDParcel(parcel)) {
        const relevantId = namesAndIds.find(
          (record) => record.name === parcel.properties.name
        )?.id;
        if (typeof relevantId !== "undefined") {
          return {
            ...obj,
            [parcel.properties.name]: getColorProperties(relevantId, 40),
          };
        }
      }
      if (isPublicLandParcel(parcel)) {
        return {
          ...obj,
          [parcel.properties.adm_manage]: getPublicLandColorProperties(
            parcel.properties.adm_manage,
            40
          ),
        };
      }
      return obj;
    }, {});

    return new Response(
      JSON.stringify({
        parcels,
        colors,
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
