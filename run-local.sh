#!/bin/bash

docker run -it --rm --env GROUPNAME=$1 --env ROOMID=$2 --env PARTICIPANTID=$3 loadtesting-load-generation-system:latest 
