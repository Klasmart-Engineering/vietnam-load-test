#!/bin/bash
set -aeuo pipefail

DISPLAY=${DISPLAY:-':99.0'}
RESOLUTION=${RESOLUTION:-'1920x1080x32'}
TEST_NAME=${TEST_NAME:-'testInHouseStay30MinutesInLive'}

rm -f ./screens/*
echo "DISPLAY: ${DISPLAY}"
echo "RESOLUTION: ${RESOLUTION}"
echo "TEST_NAME: ${TEST_NAME}"
/usr/bin/Xvfb -ac ${DISPLAY} -screen 0 ${RESOLUTION} > /dev/null 2>&1 & \
npm run ${TEST_NAME}
