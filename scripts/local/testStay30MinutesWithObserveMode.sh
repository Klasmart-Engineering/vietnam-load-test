#!bin/bash
npx nightwatch tests/inHouse/loadtest.kidsloop.vn/stay30MinutesWithObserveMode.js --room_id test_room --group_name teacher --participant_id teacher1 --env chrome &
npx nightwatch tests/inHouse/loadtest.kidsloop.vn/stay30MinutesWithObserveMode.js --room_id test_room --group_name student --participant_id student1 --env chrome 