#!/bin/bash

docker run -it --rm --env TEST_NAME=$1 --env GROUPNAME=$2 --env ROOMID=$3 --env PARTICIPANTID=$4 loadtesting-load-generation-system:latest 
