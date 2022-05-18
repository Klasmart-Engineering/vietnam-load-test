#!bin/bash
set -e
npx nightwatch tests/inHouse/loadtest.kidsloop.vn/testOutputandLogs.js --room_id ${ROOMID} --group_name ${GROUPNAME} --participant_id ${PARTICIPANTID} --env chrome --parallel