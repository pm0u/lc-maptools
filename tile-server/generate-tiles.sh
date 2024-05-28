#! /bin/bash
# Run from project root!

###
# -pt - don't combine tiny polygons
# -pC - uncompressed
# -ai - generate IDs if missing
###
OPTIONS='-ps -pt -z16 -pC -ai'

echo "Generating tiles from JSON..."

echo "Deleting existing data"
rm -rf tiles
mkdir -p tiles


if [ -f "./tippecanoe" ]; then
  echo "Using local tippecanoe executable..."
  ./tippecanoe $OPTIONS -e tiles ../data/generated/tax_parcels.json ../data/generated/public_land.json ../data/static/Eastside_Reroutes.json --force
else
  echo "Using global tippecanoe executable..."
  tippecanoe $OPTIONS -e tiles ../data/generated/tax_parcels.json ../data/generated/public_land.json ../data/static/Eastside_Reroutes.json --force
fi