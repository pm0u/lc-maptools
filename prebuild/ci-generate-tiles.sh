#! /bin/bash

apt install build-essential libsqlite3-dev zlib1g-dev

git clone https://github.com/felt/tippecanoe.git
cd tippecanoe
make -j
make install

yarn generate-all
