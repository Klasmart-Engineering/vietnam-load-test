#!/bin/bash
set -aeuo pipefail

# create the dotenv file if it doesn't exist
if [ ! -f .env ]; then
  cp .env.example .env
fi

source .env

PODS_LIST=($(kubectl get pods -n ${K8S_NAMESPACE} | grep ${JOB_NAME} | awk '{print $1}'))

for pod in "${PODS_LIST[@]}"
do
	kubectl cp -n ${K8S_NAMESPACE} $pod:/mnt/nightwatchjs/screens screens
done
