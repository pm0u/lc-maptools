#! /bin/bash

git clone https://github.com/felt/tippecanoe.git
cd tippecanoe
make -j
make install

yarn generate-all
