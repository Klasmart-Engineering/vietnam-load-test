#!/bin/bash
set -aeuo pipefail

rm -f global.html && touch global.html
cat <<EOF >> global.html
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

    echo "<p>" >> global.html
    echo "<a target='_blank' href='${REPORTS_DOMAIN}/$RUN_TIME-$TEST_NAME/$teacher_id/reports.html'>$teacher_id</a>" >> global.html
    echo "</p>" >> global.html

	for student in $(seq 1 $STUDENTS);
	do
		student_id="${room_id}student${student}"
		echo "<p>" >> global.html
        echo "<a target='_blank' href='${REPORTS_DOMAIN}/$RUN_TIME-$TEST_NAME/$student_id/reports.html'>$student_id</a>" >> global.html
        echo "</p>" >> global.html
	done
done

cat <<EOF >> global.html
</body>
</html>
EOF

if [ "$ENVIRONMENT" != "local" ]; then
echo "Upload home html to S3"
aws s3 cp --endpoint-url$STORAGE_ENDPOINT --region $AWS_REGION --recursive global.html s3://STORAGE_BUCKET/$RUN_TIME-$TEST_NAME/index.html
fi