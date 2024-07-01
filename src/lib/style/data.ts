import { sql } from "@/lib/db";

/**
 * List of names in the tax_parcels table,
 * alphabetized
 */
export const getPrivateLandNames = async () => {
  const rows =
    await sql`select distinct name from tax_parcels order by name asc`;
  return rows.map(({ name }) => name as string);
};
