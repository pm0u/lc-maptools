import {
  COUNTY_ZONING_PROPERTIES,
  PUBLIC_LAND_PROPERTIES,
  TAX_PARCEL_PROPERTIES,
} from "@/types/features";
import { getFullGeoJson } from "~/data/get-data";
import { promises } from "node:fs";
const { writeFile, mkdir, rm } = promises;
import {
  LCMD_QUERY_ENDPOINT,
  LCPL_QUERY_ENDPOINT,
  LCZ_QUERY_ENDPOINT,
} from "./constants";

export const getArcGISData = () => {
  console.log("Deleting any existing data and fetching fresh");
  return rm("generated", { force: true, recursive: true })
    .catch()
    .then(() => mkdir("generated"))
    .then(() =>
      Promise.all([
        getFullGeoJson(
          LCMD_QUERY_ENDPOINT,
          TAX_PARCEL_PROPERTIES.join(",")
        ).then((data) => {
          console.log(`Writing data for ${LCMD_QUERY_ENDPOINT}`);
          return Promise.all([
            writeFile("generated/tax_parcels.json", JSON.stringify(data)),
          ]);
        }),
        getFullGeoJson(
          LCPL_QUERY_ENDPOINT,
          PUBLIC_LAND_PROPERTIES.join(",")
        ).then((data) => {
          console.log(`Writing data for ${LCPL_QUERY_ENDPOINT}`);
          return Promise.all([
            writeFile("generated/public_land.json", JSON.stringify(data)),
          ]);
        }),
        getFullGeoJson(
          LCZ_QUERY_ENDPOINT,
          COUNTY_ZONING_PROPERTIES.join(",")
        ).then((data) => {
          console.log(`Writing data for ${LCZ_QUERY_ENDPOINT}`);
          return Promise.all([
            writeFile("generated/county_zoning.json", JSON.stringify(data)),
          ]);
        }),
      ])
    );
};
