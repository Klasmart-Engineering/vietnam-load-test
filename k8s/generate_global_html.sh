#!/bin/bash
set -aeuo pipefail

mkdir $RUN_TIME-$TEST_NAME
globalPath=$RUN_TIME-$TEST_NAME/index.html
rm -f $globalPath && touch $globalPath
cat <<EOF >> $globalPath
<!DOCTYPE html>
<html>
<title>KidsLoop Nightwatch JS Reports: $RUN_TIME-$TEST_NAME</title>
<body>
EOF

## Run nightwatchJS jobs
for class in $(seq 0 $((CONCURRENT_CLASSES-1)));
do	
	room_id="class${class}"
	teacher_id="teacher${room_id}"

    echo "<p>" >> $globalPath
    echo "<a target='_blank' href='${REPORTS_DOMAIN}/$RUN_TIME-$TEST_NAME/$teacher_id/reports.html'>$teacher_id</a>" >> $globalPath
    echo "</p>" >> $globalPath

	for student in $(seq 1 $STUDENTS);
	do
		student_id="${room_id}student${student}"
		echo "<p>" >> $globalPath
        echo "<a target='_blank' href='${REPORTS_DOMAIN}/$RUN_TIME-$TEST_NAME/$student_id/reports.html'>$student_id</a>" >> $globalPath
        echo "</p>" >> $globalPath
	done
done

cat <<EOF >> $globalPath
</body>
</html>
EOF

if [ "$ENVIRONMENT" != "local" ]; then
echo "Upload global html to S3"
aws s3 cp --endpoint-url=$STORAGE_ENDPOINT --region $AWS_REGION  --recursive ./$RUN_TIME-$TEST_NAME s3://$STORAGE_BUCKET/$RUN_TIME-$TEST_NAME
fi