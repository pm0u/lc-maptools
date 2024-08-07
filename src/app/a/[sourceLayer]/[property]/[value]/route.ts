import { sql } from "@/lib/db";
import { layerDefs } from "@/lib/spatial";
import { jsonObjectForRow } from "@/lib/spatial/json";
import { LakeCountyFeature } from "@/types/features";
import { pointOnFeature } from "@turf/turf";

export async function GET<TSourceLayer extends keyof typeof layerDefs>(
  _request: Request,
  {
    params,
  }: {
    params: {
      sourceLayer: TSourceLayer;
      property: (typeof layerDefs)[TSourceLayer][number];
      value: string;
    };
  }
) {
  const { sourceLayer, property, value } = params;

  const result = (await sql.unsafe(/* sql */ `
      select json from (
        select
          ${property},
          ${jsonObjectForRow(sourceLayer)} as json
        from
          ${sourceLayer}
        where
          CAST(${property} as varchar) = '${value}'
      )
    `)) as [{ json: LakeCountyFeature }];

  const pt = pointOnFeature(result[0].json);

  /** Works, mostly - we need some meaningful bounds/geo to make this actually work */
  /** bbox -> zoom/lng/lat */
  return new Response(null, {
    status: 302,
    headers: {
      Location: `/query/${pt.geometry.coordinates[0]},${pt.geometry.coordinates[1]}?feature=${result[0].json.id}`,
    },
  });
}
