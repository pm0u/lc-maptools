const cleanEnv = (env?: string) => env?.trim().replace(/['"]/g, "");

export const dbHost = cleanEnv(process.env.PGHOST);
export const dbDatabase = cleanEnv(process.env.PGDATABASE);
export const dbUsername = cleanEnv(process.env.PGUSER);
export const dbPassword = cleanEnv(process.env.PGPASSWORD);
export const dbPort = parseInt(cleanEnv(process.env.PGPORT ?? "5432") ?? "");
export const dbUrl = cleanEnv(process.env.DATABASE_URL);

if (!dbUrl && !(dbHost && dbUsername && dbPort && dbPassword && dbDatabase)) {
  const missing = Object.entries({
    dbUrl,
    dbHost,
    dbDatabase,
    dbUsername,
    dbPassword,
    dbPort,
  })
    .filter(([, v]) => !v)
    .map(([k]) => k);
  throw Error(`Missing Database Credentials! ${missing}`);
}
