#! /bin/bash
# Run from project root!

rm -rf public/tiles
mkdir public/tiles
tippecanoe -ps -pT -z18 -Z10 -pC -e public/tiles generated/tax_parcels.json generated/public_land.json --force