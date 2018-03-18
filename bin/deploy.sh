#!/bin/bash

cd ../

cd ./functions/

yarn
yarn run build

cd ../
cd ./www

yarn
yarn run build

cd ../

firebase deploy