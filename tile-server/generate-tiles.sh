#! /bin/bash
# Run from project root!

###
# -pt - don't combine tiny polygons
# -pC - uncompressed
# -pc - don't clip
# -ai - generate IDs if missing
# -pk - no size limit
# -pS - only simplify below maxzoom
# -pg - no tilestats in metadata (used for mapbox tile api?)
# -x - exclude property
###
FILTER='{"tax_parcels":["!=","AREAID",0]}'
echo $FILTER
EXCLUDE='-x stroke-width -x stroke-opacity -x fill -x stroke -x class -x gpstype -x pattern -x fill-opacity -x creator'
OPTIONS="-pt -z16 -pC -pc -ai -pk -pg -pS $EXCLUDE --feature-filter=$FILTER"

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