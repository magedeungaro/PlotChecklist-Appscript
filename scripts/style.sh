#!/bin/bash

> client/css/css.html

parcel build client/scss/style.scss

echo "<style>" > temp.txt

cat  temp.txt dist/style.css > client/css/css.html

> dist/style.css

cp client/css/css.html dist/style.css

echo "</style>" > temp.txt

cat  dist/style.css temp.txt  > client/css/css.html

cp dist/style.css temp.txt 

rm -r dist