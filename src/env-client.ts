const cleanEnv = (env?: string) => env?.trim().replace(/['"]/g, "");

export const mapboxToken = cleanEnv(process.env.NEXT_PUBLIC_MAPBOX_TOKEN);

if (!mapboxToken) {
  const missing = Object.entries({
    mapboxToken,
  })
    .filter(([, v]) => !v)
    .map(([k]) => k);
  throw Error(`Missing ENV vars: ${missing}`);
}
