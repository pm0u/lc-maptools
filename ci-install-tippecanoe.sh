#! /bin/bash

git clone --depth 1 --branch "$TIPPECANOE_VERSION" https://github.com/felt/tippecanoe.git tippecanoe-repo
cd tippecanoe-repo
make -j
echo "Copying to tile server directory..."
cp tippecanoe ./tile-server/tippecanoe