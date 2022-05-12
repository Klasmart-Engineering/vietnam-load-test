#!/bin/bash

rm -f /tmp/screens/* & \
/usr/bin/Xvfb -ac :99 -screen 0 1920x1080x16 & \
echo ${DISPLAY} & \
npm run testInHouseStay30MinutesInLive
