import { sql } from "@/lib/db";

/**
 * List of names in the tax_parcels table,
 * alphabetized
 */
export const privateLandNames = () => {
  return sql`select distinct name from tax_parcels order by name asc`;
};
