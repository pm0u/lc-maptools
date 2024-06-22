export const tileDomain =
  process.env.NEXT_PUBLIC_TILE_SERVER_DOMAIN?.trim().replace(/['"]/g, "");

export const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN?.trim().replace(
  /['"]/g,
  ""
);

if (!tileDomain || !mapboxToken) {
  const missing = Object.entries({ tileDomain, mapboxToken })
    .filter(([, v]) => !v)
    .map(([k]) => k);
  throw Error(`Missing ENV vars: ${missing}`);
}
