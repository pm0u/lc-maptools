#! /bin/bash
# Run from project root!

echo "Generating tiles from JSON..."

echo "Deleting existing data"
rm -rf tiles
mkdir -p tiles

if [ -f "./tippecanoe" ]; then
  echo "Using local tippecanoe executable..."
  ./tippecanoe -ps -pT -z16 -pC -e tiles ../data/generated/tax_parcels.json ../data/generated/public_land.json --force
else
  echo "Using global tippecanoe executable..."
  tippecanoe -ps -pT -z16 -pC -e tiles ../data/generated/tax_parcels.json ../data/generated/public_land.json --force
fi