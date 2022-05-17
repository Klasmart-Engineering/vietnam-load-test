#!/bin/bash
set +xeuo pipefail

source .env

if ! kubectl get namespaces -o json | jq -r ".items[].metadata.name" | grep $K8S_NAMESPACE
then
	kubectl create namespace $K8S_NAMESPACE
fi
