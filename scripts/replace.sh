#!/bin/bash

#script para substituir as server side tags do appscript (.gs)
# # Mudar &lt; para < e &gt; para >

for FILE in ../client/html/*.html;
do 
  awk '{sub("&lt;","<")}1' $FILE > temp.txt && mv temp.txt $FILE
  awk '{sub("&gt;",">")}1' $FILE > temp.txt && mv temp.txt $FILE
done