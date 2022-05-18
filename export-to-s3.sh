#!/bin/bash
set -aeuo pipefail

ENVIRONMENT=${ENVIRONMENT:-'local'}
echo "ENVIRONMENT: ${ENVIRONMENT}"

if [ "$ENVIRONMENT" != "local" ]; then
## upload screenshots
aws s3 cp --endpoint-url=$STORAGE_ENDPOINT --region $STORAGE_REGION ./screens/* s3://$STORAGE_BUCKET/screens/
## to-do: upload logs
# aws s3 cp --endpoint-url=$STORAGE_ENDPOINT --region $STORAGE_REGION ./logs/* s3://$STORAGE_BUCKET/logs/
fi