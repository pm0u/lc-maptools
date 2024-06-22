import { sql } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: { z: string; x: string; y: string } }
) {
  const { z, x, y } = params;

  /**
   * Took a lot to make this efficient with multiple layers & reducing loops
   * A combination of multiple sources but this was the most helpful
   * https://stackoverflow.com/a/66287690
   *
   * @todo create a helper to construct the subquery blocks
   */
  const tile = await sql`
    with data as

    (
      select ST_AsMVTGeom(geom, ST_TileEnvelope(${z}, ${x}, ${y})) as geom,
      ogc_fid as id,
      'tax_parcels' as layer,
      jsonb_build_object(
        'acres', acres,   
        'NAME', name
      ) as features
      from tax_parcels
      WHERE geom && ST_TileEnvelope(${z}, ${x}, ${y}, margin => (64.0 / 4096))

      union

      select ST_AsMVTGeom(geom, ST_TileEnvelope(${z}, ${x}, ${y})) as geom,
      ogc_fid as id,
      'public_land' as layer,
      jsonb_build_object(
        'adm_manage', adm_manage
      ) as features
      from public_land
      WHERE geom && ST_TileEnvelope(${z}, ${x}, ${y}, margin => (64.0 / 4096))

      union

      select ST_AsMVTGeom(geom, ST_TileEnvelope(${z}, ${x}, ${y})) as geom,
      ogc_fid as id,
      'eastside_reroutes' as layer,
      jsonb_build_object(
        'name', name,
        'description', description
      ) as features

      from eastside_reroutes
      WHERE geom && ST_TileEnvelope(${z}, ${x}, ${y}, margin => (64.0 / 4096))
    ),
    layers as 
    (
      select
        ST_AsMVT(
          data.*,
          layer,
          4096,
          'geom',
          'id'
        ) AS mvt
      FROM
        data
      GROUP BY
        layer
      )
      select string_agg(mvt, '') as geom from layers;
    `;

  const res = new Response(tile[0].geom, {
    status: 200,
    headers: { "Content-Type": "application/x-protobuf" },
  });
  return res;
}
