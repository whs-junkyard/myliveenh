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
	shasum -a 512 `find build -type f | sort`
}

echo Running first build
clean
gulp release-src
gulp release
hash > /tmp/myliveenh-expected

echo Expected hash
cat /tmp/myliveenh-expected

########################

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

########################

echo
echo Reproducing without moz restricted modules
echo

echo Running first build
rm -r build
MOZ=true gulp release
hash > /tmp/myliveenh-expected-moz

mkdir build2
cd build2

echo Unpacking source
unzip $SOURCEPATH/source.zip
cd myliveenh
# remove moz restricted modules
rm -r src/popoutvideo
echo Installing dependencies
npm install
gulp release
hash > /tmp/mylivenh-actual-moz

cd ../../
rm -r build2

########################

diff /tmp/myliveenh-expected /tmp/mylivenh-actual
if [ "$?" != "0" ]; then
	echo Test failed
	exit 1
fi

diff /tmp/myliveenh-expected-moz /tmp/mylivenh-actual-moz
if [ "$?" != "0" ]; then
	echo Test failed for MOZ builds
	exit 1
fi

echo
echo Test passed
