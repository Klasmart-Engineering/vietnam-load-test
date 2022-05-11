#!/bin/bash

K8S_NAMESPACE=klvn-beta
CONCURRENT_CLASSES=1
STUDENTS=1

for class in $(seq 1 $CONCURRENT_CLASSES);
do	
	room_id="class${class}"
	teacher_id="teacher${room_id}"
	echo "=========="
	echo "Participant: ${teacher_id}, class: ${room_id}"
	# run teacher job here
	./generateK8SJob.sh teacher $room_id $teacher_id $K8S_NAMESPACE

	for student in $(seq 1 $STUDENTS);
	do
		student_id="${room_id}student${student}"
		echo "=========="
    		echo "Participant: ${student_id}, class: ${room_id}, teacher: ${teacher_id}"
			# run student job here
			./generateK8SJob.sh student $room_id $student_id $K8S_NAMESPACE

	done
done
