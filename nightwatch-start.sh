#!/bin/bash
/usr/bin/Xvfb -ac :99 -screen 0 1280x1024x16 & \
echo ${DISPLAY} & \
npm run testInHouseStay30MinutesInLive
