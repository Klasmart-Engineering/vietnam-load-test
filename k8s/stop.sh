#!/bin/bash

set -e

kubectl delete job -n klvn-beta $(kubectl get jobs -n klvn-beta | grep nightwatch-job | awk '{print $1}')
