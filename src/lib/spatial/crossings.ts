import { sql } from "@/lib/db";
import { LAND_LAYERS, layerDefs } from "@/lib/spatial";
import { jsonObjectForRow } from "@/lib/spatial/json";
import { LakeCountyFeature } from "@/types/features";

/**
 * Ordered property crossings
 *
 * https://gis.stackexchange.com/a/425335/248669
 */
export const crossings = ({
  id,
  sourceLayer,
  crossingLayers = [...LAND_LAYERS],
}: {
  id: string;
  sourceLayer: keyof typeof layerDefs;
  crossingLayers: Array<(typeof LAND_LAYERS)[number]>;
}): Promise<Array<{ json: LakeCountyFeature }>> =>
  sql.unsafe(/* sql */ `
    select json from (
      select distinct on (ogc_fid)
        ogc_fid,
        json,
        start_frac,
        end_frac
          from (
            ${crossingLayers
              .map((crossedLayer) =>
                crossingsForLayer({ crossedLayer, id, sourceLayer })
              )
              .join(" union ")}
            order by start_frac, end_frac
          )
        order by ogc_fid, start_frac, end_frac
    ) order by start_frac, end_frac
  `);

const crossingsForLayer = ({
  crossedLayer,
  sourceLayer,
  id,
}: {
  sourceLayer: string;
  crossedLayer: (typeof LAND_LAYERS)[number];
  id: string;
}) => /* sql */ `
  select
    ${crossedLayer}.ogc_fid,
    its.path[1] as seq,
    round(start_frac::numeric, 5) as start_frac,
    round(end_frac::numeric, 5) as end_frac,
    ${jsonObjectForRow(crossedLayer)} as json,
    st_astext(its.geom)
  from
    ${crossedLayer}
    join ${sourceLayer} as ln on st_intersects (${crossedLayer}.geom, ln.geom)
    cross join lateral st_dump(st_intersection (${crossedLayer}.geom, ln.geom)) as its
    cross join lateral st_linelocatepoint(ln.geom, st_startpoint(its.geom)) as start_frac
    cross join lateral st_linelocatepoint(ln.geom, st_endpoint(its.geom)) as end_frac
  where
    ln.ogc_fid = ${id}
`;
