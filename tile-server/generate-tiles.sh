#! /bin/bash
# Run from project root!

rm -rf tiles
mkdir -p tiles

if [ -f "./tippecanoe" ]; then
  echo "Using local tippecanoe executable"
  ./tippecanoe -ps -pT -z16 -pC -e tiles ../data/generated/tax_parcels.json ../data/generated/public_land.json --force
else
  tippecanoe -ps -pT -z16 -pC -e tiles ../data/generated/tax_parcels.json ../data/generated/public_land.json --force
fi