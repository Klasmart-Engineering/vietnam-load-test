#!bin/bash
npx nightwatch tests/inHouse/loadtest.kidsloop.vn/stay30MinutesInLive.js --room_id abc --group_name teacher --participant_id 123 --env chrome --parallel --reporter html-reporter.js &
npx nightwatch tests/inHouse/loadtest.kidsloop.vn/stay30MinutesInLive.js --room_id abc --group_name student --participant_id 345 --env chrome --parallel --reporter html-reporter.js