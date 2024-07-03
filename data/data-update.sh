#! /bin/bash
yarn data:arcgis

FILES=`ls generated/*.json`

for ENTRY in "generated"/*;
do
  FILENAME="$(basename "$ENTRY")"
  LAYER_NAME="${FILENAME%.*}"
  EXTENSION="$(echo "${FILENAME#*.}")"
  ogr2ogr -f PGDUMP -t_srs EPSG:3857 -nln "$LAYER_NAME" "generated/${LAYER_NAME}.sql" "$ENTRY" -lco geometry_name=geom
done
  