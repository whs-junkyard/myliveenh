#!/bin/bash
set -x
set -e
if [ "$MOZ" = "true" ]; then
	mv release.zip release-moz.zip
else
	mv release.zip release-chrome.zip
fi
