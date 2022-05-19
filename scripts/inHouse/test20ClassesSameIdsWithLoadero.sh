#!/bash/bash

ROOM_ID_LIST="$(npm run getLoaderoRoomIds --silent)";

for i in $ROOM_ID_LIST; do
    echo $i;
done

# curl -X POST  https://api.loadero.com/v2/projects/10560/tests/14341/runs/ -H "Authorization: Bearer YJE0NGFJYMETM2MWNY0ZMWY4LTGXYTCTMWE5OGQ0OWM5YZUX"