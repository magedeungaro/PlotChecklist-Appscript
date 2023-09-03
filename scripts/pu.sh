#!/bin/bash

git add .

echo "enter commit message"
read message

git commit -m "$message"

branch=$(git rev-parse --abbrev-ref HEAD) 

git push origin $branch

echo "Wish to open a pull request? \n [Y/Enter to exit]"
read PR

if [[ "$PR" == [yY] ]]
  then gh pr create
fi