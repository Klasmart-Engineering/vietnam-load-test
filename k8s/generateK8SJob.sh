#!/bin/bash

set -e 

VERSION=$(cat ../VERSION)
GROUPNAME=$1
ROOMID=$2
PARTICIPANTID=$3
K8S_NAMESPACE=$4

cat <<EOF | kubectl apply -f -
apiVersion: batch/v1
kind: Job
metadata:
  namespace: ${K8S_NAMESPACE}
  name: "nightwatch-job-${PARTICIPANTID}"
  labels:
    job: "nightwatch"
spec:
  ttlSecondsAfterFinished: 10
  template:
    metadata:
      labels:
        job: "nightwatch"
    spec:
      hostNetwork: true
#      dnsPolicy: ClusterFirstWithHostNet
      imagePullSecrets:
        - name: ecr-registry-infra-singapore
      restartPolicy: OnFailure
      containers:      
      - name: nightwatch-job      
        image: 942095822719.dkr.ecr.ap-southeast-1.amazonaws.com/loadtesting-load-generation-system:${VERSION}
        imagePullPolicy: IfNotPresent     
        env:
          - name: GROUPNAME
            value: "${GROUPNAME}"
          - name: ROOMID
            value: "${ROOMID}" 
          - name: PARTICIPANTID
            value: "${PARTICIPANTID}"
        resources:
          requests:
            cpu: 250m
            memory: 256Mi
          limits:
            cpu: 1250m
            memory: 1Gi
EOF
