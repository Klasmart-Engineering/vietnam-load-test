#!/bin/bash
set -aeuo pipefail

ENVIRONMENT=${ENVIRONMENT:-'local'}
echo "ENVIRONMENT: ${ENVIRONMENT}"

## not upload report when running run-local.sh
if [ "$ENVIRONMENT" != "local" ]; then
    ## upload screenshots
    # aws s3 cp --endpoint-url=$STORAGE_ENDPOINT --region $AWS_REGION --recursive ./screens s3://$STORAGE_BUCKET/screens
    ## upload logs
    aws s3 cp --endpoint-url=$STORAGE_ENDPOINT --region $AWS_REGION --recursive ./reports s3://$STORAGE_BUCKET/
fi