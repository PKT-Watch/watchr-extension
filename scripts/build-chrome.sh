#!/bin/bash
platform="chrome"
directory="./dist/${platform}/"
mkdir -p $directory
cp -R ./extension/ $directory

# Chrome requires the directory contents to be zipped including the parent directory
# -x to exclude hidden files and directories (eg. .DS_Store, __MACOSX)
cd ./dist
zip -r ${platform}.zip $platform -x '**/.*' '**/__MACOSX'