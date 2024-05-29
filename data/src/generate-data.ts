import { getFullGeoJson } from "./internal";
import { promises } from "node:fs";
import { LCMD_QUERY_ENDPOINT, LCPL_QUERY_ENDPOINT } from "./internal";
import { layerifyByOwner, layerifyPublicLand } from "./internal";
const { writeFile, mkdir, rm } = promises;

export const generateData = () => {
  console.log("Deleting any existing data and fetching fresh");
  return rm("generated", { force: true, recursive: true })
    .catch()
    .then(() => mkdir("generated"))
    .then(() =>
      Promise.all([
        getFullGeoJson(
          LCMD_QUERY_ENDPOINT,
          "NAME,MILL_LEVY,ASSESSED_V,FID"
        ).then((data) => {
          const layerStyles = layerifyByOwner(data);
          console.log(`Writing data for ${LCMD_QUERY_ENDPOINT}`);
          return Promise.all([
            writeFile(
              "generated/tax_parcel-layer-styles.json",
              JSON.stringify(layerStyles)
            ),
            writeFile("generated/tax_parcels.json", JSON.stringify(data)),
          ]);
        }),
        getFullGeoJson(LCPL_QUERY_ENDPOINT, "adm_manage,FID").then((data) => {
          const layerStyles = layerifyPublicLand();
          console.log(`Writing data for ${LCPL_QUERY_ENDPOINT}`);
          return Promise.all([
            writeFile(
              "generated/public_land-layer-styles.json",
              JSON.stringify(layerStyles)
            ),
            writeFile("generated/public_land.json", JSON.stringify(data)),
          ]);
        }),
      ])
    );
};
