#! /bin/bash
# Run from project root!

rm -rf public/tax-parcels
rm -rf public/public-land
mkdir public/tax-parcels
mkdir public/public-land
tippecanoe -ps -pT -z19 -e public/tiles generated/tax_parcels.json generated/public_land.json --force &
#tippecanoe -ps -pT -z19 -e public/public-land generated/public_land.json --force &
wait
rm generated/tax_parcels.json
rm generated/public_land.json