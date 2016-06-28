#!/bin/bash
set -ex
git archive --format zip --prefix myliveenh/ -o source.zip HEAD

npm shrinkwrap --dev
mkdir /tmp/myliveenh
mv npm-shrinkwrap.json /tmp/myliveenh/

ZIPPATH=`pwd`
cd /tmp/
zip --must-match $ZIPPATH/source.zip myliveenh/npm-shrinkwrap.json

rm -r /tmp/myliveenh/
