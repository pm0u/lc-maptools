import {
  AvailableLCMDProperties,
  AvailablePublicLandProperties,
} from "@/types/properties";

/**
 * Properties included in tiles
 */
export const layerDefs = {
  tax_parcels: ["NAME", "ACRES", "ASSESSED_V", "AREAID"] satisfies Array<
    keyof AvailableLCMDProperties
  >,
  public_land: ["adm_manage", "GIS_acres"] satisfies Array<
    keyof AvailablePublicLandProperties
  >,
  eastside_reroutes: ["description", "name"],
  tax_parcels_old: ["NAME", "ACRES"],
};

export const allLayers = Object.keys(layerDefs) as Array<
  keyof typeof layerDefs
>;

export const LAND_LAYERS = [
  "tax_parcels",
  "public_land",
  "tax_parcels_old",
] as const satisfies Array<keyof typeof layerDefs>;

export const DEFAULT_LAND_LAYERS = [
  "tax_parcels",
  "public_land",
] as const satisfies Array<keyof typeof layerDefs>;

export const DEFAULT_TILE_LAYERS = [
  "tax_parcels",
  "public_land",
  "eastside_reroutes",
] as const satisfies Array<keyof typeof layerDefs>;
