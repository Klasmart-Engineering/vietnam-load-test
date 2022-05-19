#!/bin/bash
set -aeuo pipefail

## Prepare variables for the test
DISPLAY=${DISPLAY:-':99.0'}
RESOLUTION=${RESOLUTION:-'1920x1080x32'}
TEST_NAME=${TEST_NAME:-'testInHouseStay30MinutesInLive'}
RUN_TIME=${RUN_TIME:-$(date '+%Y-%m-%d-%H-%M-%S')}
echo "DISPLAY: ${DISPLAY}"
echo "RESOLUTION: ${RESOLUTION}"
echo "TEST_NAME: ${TEST_NAME}"
echo "RUN_TIME: ${RUN_TIME}"
mkdir -p ./reports/
mkdir -p ./screens/

## Run the test
/usr/bin/Xvfb -ac ${DISPLAY} -screen 0 ${RESOLUTION} > /dev/null 2>&1 & \
npm run ${TEST_NAME}

## Export Screenshots & Logs to S3
./export-to-s3.sh

exit 0
