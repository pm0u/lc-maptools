import { sql } from "@/lib/db";
import { DEFAULT_LAND_LAYERS, LAND_LAYERS, layerDefs } from "@/lib/spatial";
import { jsonObjectForRow } from "@/lib/spatial/json";

const SPLIT_LINE_CTE = "segments";

export const crossings = ({
  id,
  sourceLayer,
  crossingLayers = [...DEFAULT_LAND_LAYERS],
}: {
  id: string;
  sourceLayer: keyof typeof layerDefs;
  crossingLayers: Array<(typeof LAND_LAYERS)[number]>;
}) => {
  return sql.unsafe(/* sql */ `
    ${segmentLine(sourceLayer, id)}
    -- select only json column
    SELECT json
    FROM (
      -- select these columns for ordering
      SELECT 
        seq,
        intersection_point,
        json
      FROM (
        -- select these columns for de-duping / false positives ?
        SELECT DISTINCT
          ON (parcel_id) parcel_id,
            json,
            seq,
            intersection_point
        FROM (
          ${crossingLayers
            .map((crossedLayer) =>
              crossingsForLayer({ sourceLayer, crossedLayer, id })
            )
            .join(" UNION ")}
          )
        ORDER BY parcel_id,
          seq,
          intersection_point
        )
      ORDER BY seq,
        intersection_point
      )
  `);
};

/**
 * https://gis.stackexchange.com/a/390226
 */
const segmentLine = (
  layer: keyof typeof layerDefs,
  id: number | string
) => /* sql */ `
    WITH ${SPLIT_LINE_CTE}
    AS (
      SELECT 
        ogc_fid,
        seq,
        geom
      FROM (
        -- Split line into segments of 2 consecutive points with a column for line ID and sequential order
        SELECT ln.ogc_fid,
          dmp.path [1] AS seq,
          ST_MakeLine(
          dmp.geom, 
          LEAD(dmp.geom) OVER (PARTITION BY ln.ogc_fid ORDER BY dmp.path)
        ) AS geom
        FROM
          ${layer} AS ln,
          LATERAL ST_DumpPoints(ln.geom) AS dmp
        )
      WHERE geom IS NOT NULL AND ogc_fid = ${id}
      )`;

const crossingsForLayer = ({
  sourceLayer,
  crossedLayer,
  id,
}: {
  sourceLayer: string;
  crossedLayer: (typeof LAND_LAYERS)[number];
  id: string;
}) => {
  return /* sql */ `
    SELECT
      ${crossedLayer}.ogc_fid AS parcel_id,
      seq,
      ST_LineLocatePoint(
        ${SPLIT_LINE_CTE}.geom,
        st_centroid(st_intersection(${SPLIT_LINE_CTE}.geom, ${crossedLayer}.geom))
      ) AS intersection_point,
      ${jsonObjectForRow(crossedLayer)} as json
    FROM ${SPLIT_LINE_CTE}
    JOIN ${crossedLayer}
      ON ST_Crosses(${SPLIT_LINE_CTE}.geom, ${crossedLayer}.geom)
    WHERE ST_Crosses((
          SELECT geom
          FROM ${sourceLayer}
          WHERE ogc_fid = ${id}
          ), ${crossedLayer}.geom)
  `;
};
