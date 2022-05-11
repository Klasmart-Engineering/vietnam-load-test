#!bin/bash
set -e
npx nightwatch tests/inHouse/loadtest.kidsloop.vn/stay30MinutesInLive.js --room_id ${ROOMID} --group_name ${GROUPNAME} --participant_id ${PARTICIPANTID} --env chrome --parallel
exit 0