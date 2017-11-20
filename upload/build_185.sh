#!/bin/bash

cd ../

git pull

echo "git pull done...."

sudo gulp dist

echo "run gulp dist done...."

cd dist
BASE_DIR=$(pwd)

FILE_NAME=$(ls -at ${BASE_DIR} | grep "SmartContainer-0.6.8-BUILD" | head -n 1)
FULL_NAME=$(pwd)/${FILE_NAME}

echo "found file name: ${FULL_NAME}"

cd ../upload/

./scp.sh ${FILE_NAME} ${FULL_NAME}

echo "copy ${FULL_NAME} done"
