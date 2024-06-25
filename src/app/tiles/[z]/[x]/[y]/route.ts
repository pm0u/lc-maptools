import { tileQuery } from "@/lib/tile";

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

export async function GET(
  _request: Request,
  { params }: { params: { z: string; x: string; y: string } }
) {
  try {
    assertTileParams(params);
    const { z, x, y } = params;

    const tile = await tileQuery({ z, x, y });

    const res = new Response(tile[0].mvt, {
      status: 200,
      headers: { "Content-Type": "application/x-protobuf" },
    });
    return res;
  } catch (e) {
    console.error(params, e);
    const res = new Response(null, { status: 404 });
    return res;
  }
}
