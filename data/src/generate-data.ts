import {
  PUBLIC_LAND_PROPERTIES,
  TAX_PARCEL_PROPERTIES,
  getFullGeoJson,
} from "./internal";
import { promises } from "node:fs";
import { LCMD_QUERY_ENDPOINT, LCPL_QUERY_ENDPOINT } from "./internal";
import { layerifyByOwner, layerifyPublicLand } from "./internal";
const { writeFile, mkdir, rm } = promises;
import oldParcelJson from "../static/tax_parcels_old.json";

export const generateData = () => {
  console.log("Deleting any existing data and fetching fresh");
  return rm("data/generated", { force: true, recursive: true })
    .catch()
    .then(() => mkdir("data/generated"))
    .then(() =>
      Promise.all([
        getFullGeoJson(
          LCMD_QUERY_ENDPOINT,
          TAX_PARCEL_PROPERTIES.join(",")
        ).then((data) => {
          const layerStyles = layerifyByOwner(data);
          console.log(`Writing data for ${LCMD_QUERY_ENDPOINT}`);
          return Promise.all([
            writeFile(
              "data/generated/tax_parcels-layer-styles.json",
              JSON.stringify(layerStyles)
            ),
            writeFile("data/generated/tax_parcels.json", JSON.stringify(data)),
          ]);
        }),
        getFullGeoJson(
          LCPL_QUERY_ENDPOINT,
          PUBLIC_LAND_PROPERTIES.join(",")
        ).then((data) => {
          const layerStyles = layerifyPublicLand();
          console.log(`Writing data for ${LCPL_QUERY_ENDPOINT}`);
          return Promise.all([
            writeFile(
              "data/generated/public_land-layer-styles.json",
              JSON.stringify(layerStyles)
            ),
            writeFile("data/generated/public_land.json", JSON.stringify(data)),
          ]);
        }),
      ]).then(async () => {
        // @ts-expect-error
        const layerStyles = layerifyByOwner(oldParcelJson);
        console.log(`Writing data for old tax parcels`);
        return Promise.all([
          writeFile(
            "data/generated/tax_parcels_old-layer-styles.json",
            JSON.stringify(layerStyles)
          ),
          writeFile(
            "data/generated/tax_parcels_old.json",
            JSON.stringify(oldParcelJson)
          ),
        ]);
      })
    );
};
