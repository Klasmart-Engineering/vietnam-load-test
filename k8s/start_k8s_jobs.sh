#!/bin/bash
set -aeuo pipefail

# create the dotenv file if it doesn't exist
if [ ! -f .env ]; then
	cp .env.example .env
fi

source .env

## Run nightwatchJS jobs
for class in $(seq 0 $((CONCURRENT_CLASSES-1)));
do	
	room_id="class${class}"
	teacher_id="teacher${room_id}"
	echo "=========="
	echo "Participant: ${teacher_id}, class: ${room_id}"	
	### Run teacher job
	./generate_k8s_job.sh teacher $room_id $teacher_id

	for student in $(seq 1 $STUDENTS);
	do
		student_id="${room_id}student${student}"
		echo "=========="
		echo "Participant: ${student_id}, class: ${room_id}, teacher: ${teacher_id}"
		### Run student job
		./generate_k8s_job.sh student $room_id $student_id
	done
done

./generate_home_html.sh
./generate_global_html.sh

## Run assistant teacher on Loadero
if [ "$LOADERO_ENABLED" = true ] ; then
	### change the number of concurrent classes on loadero
	curl -X PUT "https://api.loadero.com/v2/projects/${LOADERO_PROJECT_ID}/tests/${LOADERO_TEST_ID}/groups/${LOADERO_GROUP_ID}/" \
	-d "{\"name\": \"Class\", \"count\": ${CONCURRENT_CLASSES}}" \
	-H "Content-Type: application/json" \
	-H "Authorization: ${LOADERO_ACCESS_TOKEN}"
	
	exit 0
	### Run loadero
	curl -X POST  "https://api.loadero.com/v2/projects/${LOADERO_PROJECT_ID}/tests/${LOADERO_TEST_ID}/runs/" \
	-H "Authorization: ${LOADERO_ACCESS_TOKEN}"
fi