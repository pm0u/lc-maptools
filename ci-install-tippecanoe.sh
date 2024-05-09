#! /bin/bash

git clone --depth 1 --branch 2.35.0 https://github.com/felt/tippecanoe.git tippecanoe-repo
cd tippecanoe-repo
make -j
cp tippecanoe ..
