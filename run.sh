#!/bin/bash

docker run -it --rm --env GROUPNAME=$1 nightwatch:latest 
