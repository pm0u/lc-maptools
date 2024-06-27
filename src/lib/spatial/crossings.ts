import { sql } from "@/lib/db";
import { DEFAULT_LAND_LAYERS, LAND_LAYERS } from "@/lib/spatial";
import {
  AvailableLCMDProperties,
  AvailablePublicLandProperties,
} from "@/types/properties";

const identifyingProperties = {
  tax_parcels: ["NAME"] satisfies Array<keyof AvailableLCMDProperties>,
  public_land: ["adm_manage as name"] satisfies Array<
    keyof AvailablePublicLandProperties
  >,
  tax_parcels_old: ["NAME"],
};

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
    SELECT ogc_fid as id, ${identifyingProperties[crossedLayer].join(
      ", "
    )}, '${crossedLayer}' as sourceLayer
    from ${crossedLayer}
    where ST_Crosses((select geom from ${sourceLayer} where ogc_fid = ${id}), geom)
  `;
};

export const crossings = ({
  id,
  sourceLayer,
  crossingLayers = [...DEFAULT_LAND_LAYERS],
}: {
  id: string;
  sourceLayer: string;
  crossingLayers: Array<(typeof LAND_LAYERS)[number]>;
}) => {
  return sql`${sql.unsafe(
    crossingLayers
      .map((crossedLayer) =>
        crossingsForLayer({ sourceLayer, crossedLayer, id })
      )
      .join(" union ")
      .replace(/\s+/g, " ")
  )}`;
};
