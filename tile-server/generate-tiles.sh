#! /bin/bash
# Run from project root!

###
# -ps - don't simplify
# -pt - don't combine tiny polygons
# -pC - uncompressed
# -pD - no duplication (features can extend past tile boundaries, only one per zoom level)
###
OPTIONS='-ps -pt -z16 -pC -pc'

echo "Generating tiles from JSON..."

echo "Deleting existing data"
rm -rf tiles
mkdir -p tiles


if [ -f "./tippecanoe" ]; then
  echo "Using local tippecanoe executable..."
  ./tippecanoe $OPTIONS -e tiles ../data/generated/tax_parcels.json ../data/generated/public_land.json --force
else
  echo "Using global tippecanoe executable..."
  tippecanoe $OPTIONS -e tiles ../data/generated/tax_parcels.json ../data/generated/public_land.json --force
fi