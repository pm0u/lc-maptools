import postgres from "postgres";

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

export const sql = postgres({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
});

export const selectAll = () => {
  return sql`SELECT * FROM eastside_reroutes`;
};

export const eastsideMVT = () => {
  return sql`SELECT ST_asMVT(eastside_reroutes.geom) from eastside_reroutes`;
};
