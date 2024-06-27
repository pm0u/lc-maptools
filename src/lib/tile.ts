import { sql } from "@/lib/db";
import {
  AvailableLCMDProperties,
  AvailablePublicLandProperties,
} from "@/types/properties";

export const layerDefs = {
  tax_parcels: ["NAME", "ACRES"] satisfies Array<keyof AvailableLCMDProperties>,
  public_land: ["adm_manage", "GIS_acres"] satisfies Array<
    keyof AvailablePublicLandProperties
  >,
  eastside_reroutes: ["description", "name"],
};

export const allLayers = Object.keys(layerDefs) as Array<
  keyof typeof layerDefs
>;

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
  (SELECT ST_AsMVT(q, '${layer}', 4096, 'geom', 'id') AS l FROM
        (SELECT ST_AsMvtGeom(
            geom,
            ST_TileEnvelope(${z}, ${x}, ${y}),
            4096,
            64,
            true
            ) AS geom, ogc_fid as id, ${fields.join(", ")}
       FROM ${layer} WHERE (geom && ST_TileEnvelope(${z}, ${x}, ${y}))) AS q)
  `;

export const tileQuery = ({
  z,
  x,
  y,
  layers = allLayers,
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
