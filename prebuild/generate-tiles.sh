#! /bin/bash
# Run from project root!

rm -rf public/tiles
mkdir -p public/tiles

if [ -f "./tippecanoe" ]; then
  echo "Using local tippecanoe executable"
  ./tippecanoe -ps -pT -z18 -pC -e public/tiles generated/tax_parcels.json generated/public_land.json --force
else
  tippecanoe -ps -pT -z18 -pC -e public/tiles generated/tax_parcels.json generated/public_land.json --force
fi