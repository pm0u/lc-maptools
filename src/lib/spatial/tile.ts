import { sql } from "@/lib/db";
import { DEFAULT_TILE_LAYERS, layerDefs } from "@/lib/spatial";

export const queryLayer = ({
  z,
  x,
  y,
  layer,
  fields,
}: {
  z: string;
  x: string;
  y: string;
  layer: string;
  fields: string[];
}) => /* sql */ `
  (SELECT ST_AsMVT(q, '${layer}', 4096, 'geom', 'ogc_fid') AS l FROM
        (SELECT ST_AsMvtGeom(
            geom,
            ST_TileEnvelope(${z}, ${x}, ${y}),
            4096,
            64,
            true
            ) AS geom, ogc_fid, ${fields.join(", ")}
       FROM ${layer} WHERE (geom && ST_TileEnvelope(${z}, ${x}, ${y}))) AS q)
  `;

export const tileQuery = ({
  z,
  x,
  y,
  layers = DEFAULT_TILE_LAYERS,
}: {
  z: string;
  x: string;
  y: string;
  layers?: Array<keyof typeof layerDefs>;
}) =>
  sql`select (${sql.unsafe(
    layers
      .map((layer) => queryLayer({ z, x, y, layer, fields: layerDefs[layer] }))
      .join(" || ")
      .replace(/\s+/g, " ")
  )}) as mvt`;
