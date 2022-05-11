#!/bin/bash

VERSION="$(cat VERSION)"
aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin 942095822719.dkr.ecr.ap-southeast-1.amazonaws.com
docker tag loadtesting-load-generation-system:latest 942095822719.dkr.ecr.ap-southeast-1.amazonaws.com/loadtesting-load-generation-system:latest
docker push 942095822719.dkr.ecr.ap-southeast-1.amazonaws.com/loadtesting-load-generation-system:latest

docker tag loadtesting-load-generation-system:latest 942095822719.dkr.ecr.ap-southeast-1.amazonaws.com/loadtesting-load-generation-system:${VERSION}
docker push 942095822719.dkr.ecr.ap-southeast-1.amazonaws.com/loadtesting-load-generation-system:${VERSION}
