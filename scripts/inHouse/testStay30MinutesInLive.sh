#!bin/bash
npx nightwatch tests/inHouse/loadtest.kidsloop.vn/stay30MinutesInLive.js --room_id abc --group_name ${GROUPNAME} --participant_id ${HOSTNAME} --env chrome --parallel