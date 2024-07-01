export const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN?.trim().replace(
  /['"]/g,
  ""
);

if (!mapboxToken) {
  const missing = Object.entries({ mapboxToken })
    .filter(([, v]) => !v)
    .map(([k]) => k);
  throw Error(`Missing ENV vars: ${missing}`);
}
