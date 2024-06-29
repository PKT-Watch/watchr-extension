#!/bin/bash
platform="firefox"
directory="./dist/${platform}"
cp -R ./extension/ $directory

# Firefox requires a different manifest file
# Delete the Chrome manifest file and rename the Firefox manifest file
rm $directory/manifest.json
mv $directory/manifest.${platform}.json $directory/manifest.json

# Firefox requires the directory contents to be zipped without the parent directory
# -x to exclude hidden files and directories (eg. .DS_Store, __MACOSX)
cd ./dist
(cd ./${platform} && zip -r ../${platform}.zip  ./* -x '**/.*' '**/__MACOSX')