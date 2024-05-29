import { getFullGeoJson } from "../src/lib/data";
import { promises } from "node:fs";
import { LCMD_QUERY_ENDPOINT, LCPL_QUERY_ENDPOINT } from "@/constants";
import { layerifyByOwner, layerifyPublicLand } from "@/lib/layerify";
const { writeFile, mkdir, rm } = promises;

const main = () => {
  return rm("generated", { force: true, recursive: true })
    .catch()
    .then(() => mkdir("generated"))
    .then(() =>
      Promise.all([
        getFullGeoJson(LCMD_QUERY_ENDPOINT, "NAME,MILL_LEVY,ASSESSED_V").then(
          (data) => {
            const layerStyles = layerifyByOwner(data);
            return Promise.all([
              writeFile(
                "generated/tax_parcel-layer-styles.json",
                JSON.stringify(layerStyles)
              ),
              writeFile("generated/tax_parcels.json", JSON.stringify(data)),
            ]);
          }
        ),
        getFullGeoJson(LCPL_QUERY_ENDPOINT, "adm_manage").then((data) => {
          const layerStyles = layerifyPublicLand();
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

main();
