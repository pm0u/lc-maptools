import { TILE_DATA_CDN_CACHE, TILE_DATA_CLIENT_CACHE } from "@/config/cache";
import { getLCMDLayers } from "@/lib/style";
import { extendMapboxStandard } from "@/lib/style/mapbox-standard";

export async function GET(req: Request) {
  const lcmdLayers = await getLCMDLayers();

  const style = extendMapboxStandard({
    sources: {
      LCMDParcels: {
        type: "vector",
        tiles: [
          `${
            req.headers.get("x-forwarded-proto") ?? "http"
          }://${req.headers.get("host")}/tiles/{z}/{x}/{y}`,
        ],
      },
    },
    // @ts-expect-error
    layers: [...lcmdLayers],
  });

  const res = new Response(JSON.stringify(style), {
    headers: {
      "Content-Type": "application/json",
      "s-max-age": TILE_DATA_CDN_CACHE.toString(),
      "max-age": TILE_DATA_CLIENT_CACHE.toString(),
    },
  });

  return res;
}
