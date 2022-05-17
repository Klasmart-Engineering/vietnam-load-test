#!/bin/bash

rm -f ./screens/* & \
/usr/bin/Xvfb -ac :99 -screen 0 1920x1080x32 > /dev/null 2>&1 & \
echo ${DISPLAY} & \
npm run testInHouseStay30MinutesInLive
