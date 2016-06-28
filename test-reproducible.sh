#!/bin/bash
set -e

echo
echo Testing reproducible build
echo

clean(){
	rm -r build build2 || true
	rm -r release-*.zip || true
}
hash(){
	shasum -a 512 `find build -name \*.js | sort`
}

echo Running first build
clean
gulp release
hash > /tmp/myliveenh-expected

echo Expected hash
cat /tmp/myliveenh-expected

SOURCEPATH=`pwd`

echo
echo Reproducing from packed source...
echo

mkdir build2
cd build2

echo Unpacking source
unzip $SOURCEPATH/source.zip
cd myliveenh
echo Installing dependencies
npm install
gulp release
hash > /tmp/mylivenh-actual

cd ../../
rm -r build2

if [ `cat /tmp/myliveenh-expected` != `cat /tmp/mylivenh-actual` ]; then
	diff /tmp/myliveenh-expected /tmp/mylivenh-actual
	echo Test failed
	exit 1
fi

echo
echo Test passed
