import { sql } from "@/lib/db";

/**
 * List of names in the tax_parcels table,
 * alphabetized
 */
export const getPrivateLandNames = async () => {
  const rows = await sql<
    Array<{ name: string; id: number }>
  >/* sql */ `select id, name from (select distinct on (name) name, ogc_fid as id from tax_parcels order by name, id) order by id`;
  return rows;
};
