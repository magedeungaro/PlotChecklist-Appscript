#!/bin/bash

echo 'copying files from local to src...'

cp -a ./uni/*js ./src/
cp -a ./client/css/. ./src/
cp -a ./client/html/. ./src/
cp -a ./client/js/. ./src/

echo 'done :)'