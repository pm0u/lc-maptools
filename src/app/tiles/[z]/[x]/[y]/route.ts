import { TILE_DATA_CDN_CACHE, TILE_DATA_CLIENT_CACHE } from "@/config/cache";
import { tileQuery } from "@/lib/spatial/tile";

type TileParams = { z: string; x: string; y: string };

const isNumberString = (val: any) => {
  // Not a number
  if (isNaN(Number(val))) {
    return false;
  }
  // A decimal number
  if (parseFloat(val) !== parseInt(val)) {
    return false;
  }
  // maybe a weird hex number
  if (/[^0-9]/.test(val)) {
    return false;
  }
  return true;
};

/**
 * Planetary limits
 */
const maxY = 2 ** 22;
const maxX = 2 ** 22;
/**
 * Mapbox zoom limit
 */
const maxZ = 22;

const isValidX = (x: number) => x >= 0 && x <= maxX;
const isValidY = (y: number) => y >= 0 && y <= maxY;
const isValidZ = (z: number) => z >= 0 && z <= maxZ;

function assertTileParams(params: object): asserts params is TileParams {
  if (!("x" in params) || !("y" in params) || !("z" in params))
    throw Error("Invalid params");
  if (
    !isNumberString(params.x) ||
    !isNumberString(params.y) ||
    !isNumberString(params.z)
  )
    throw Error("Invalid params");
}

function assertPositionValues(
  params: TileParams
): asserts params is TileParams {
  if (
    !isValidZ(parseInt(params.z)) ||
    !isValidX(parseInt(params.x)) ||
    !isValidY(parseInt(params.y))
  ) {
    throw Error("Invalid param value range");
  }
}

export async function GET(
  _request: Request,
  { params }: { params: { z: string; x: string; y: string } }
) {
  try {
    try {
      try {
        assertTileParams(params);
      } catch (e) {
        const res = new Response(null, {
          status: 400,
          statusText: "Tile position unparseable",
        });
        return res;
      }
      assertPositionValues(params);
    } catch (e) {
      const res = new Response(null, {
        status: 400,
        statusText: "Tile position out of range",
      });
      return res;
    }

    const { z, x, y } = params;

    const tile = await tileQuery({ z, x, y });

    const res = new Response(tile[0].mvt, {
      status: 200,
      headers: {
        "Content-Type": "application/x-protobuf",
        "s-max-age": TILE_DATA_CDN_CACHE.toString(),
        "max-age": TILE_DATA_CLIENT_CACHE.toString(),
      },
    });
    return res;
  } catch (e) {
    console.error(params, e);
    const res = new Response(null, { status: 404 });
    return res;
  }
}
