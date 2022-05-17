#!/bin/bash
set -aeuo pipefail

GROUPNAME=$1
ROOMID=$2
PARTICIPANTID=$3

cat <<EOF | kubectl apply -f -
apiVersion: batch/v1
kind: Job
metadata:
  namespace: ${K8S_NAMESPACE}
  name: "${JOB_NAME}-${PARTICIPANTID}"
  labels:
    job: "${JOB_NAME}"
spec:
  ttlSecondsAfterFinished: 10
  template:
    metadata:
      labels:
        job: "${JOB_NAME}"
    spec:
      hostNetwork: true
#      dnsPolicy: ClusterFirstWithHostNet
      imagePullSecrets:
        - name: ${IMAGE_PULL_SECRET}
      restartPolicy: OnFailure
      containers:      
      - name: ${JOB_NAME}      
        image: ${ECR_DOMAIN}/${ECR_REPO}:${VERSION}
        imagePullPolicy: IfNotPresent     
        env:
          - name: GROUPNAME
            value: "${GROUPNAME}"
          - name: ROOMID
            value: "${ROOMID}" 
          - name: PARTICIPANTID
            value: "${PARTICIPANTID}"
          - name: DISPLAY
            value: "${DISPLAY}"
          - name: RESOLUTION
            value: "${RESOLUTION}"
          - name: TEST_NAME
            value: "${TEST_NAME}"                                    
        resources:
          requests:
            cpu: 250m
            memory: 256Mi
          limits:
            cpu: 1250m
            memory: 1Gi
EOF
