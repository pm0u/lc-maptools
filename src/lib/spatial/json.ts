import { layerDefs } from "@/lib/spatial";

export const jsonObjectForRow = (layer: keyof typeof layerDefs) => /* sql */ `
  jsonb_build_object(
    'type',         'Feature', 
    'id',           "${layer}"."ogc_fid",
    'source',       'LCMDParcels',
    'sourceLayer',  '${layer}',
    'geometry',     ST_AsGeoJson(ST_Transform(${layer}.geom, 4326))::jsonb,
    'properties',   jsonb_build_object(${layerDefs[layer]
      .map((col) => `'${col}', ${layer}.${col}`)
      .join(", ")}
                    )
  )
`;
