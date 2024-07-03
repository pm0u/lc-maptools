import {
  PUBLIC_LAND_PROPERTIES,
  TAX_PARCEL_PROPERTIES,
} from "@/types/features";

/**
 * Properties included in tiles
 */
export const layerDefs = {
  tax_parcels: TAX_PARCEL_PROPERTIES,
  public_land: PUBLIC_LAND_PROPERTIES,
  eastside_reroutes: ["description", "name"],
};

export const allLayers = Object.keys(layerDefs) as Array<
  keyof typeof layerDefs
>;

export const LAND_LAYERS = [
  "tax_parcels",
  "public_land",
] as const satisfies Array<keyof typeof layerDefs>;

export const DEFAULT_TILE_LAYERS = [
  "tax_parcels",
  "public_land",
  "eastside_reroutes",
] as const satisfies Array<keyof typeof layerDefs>;
