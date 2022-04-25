#!/bin/bash

docker run -it --rm --env GROUPNAME=$1 loadtesting-load-generation-system:latest 
