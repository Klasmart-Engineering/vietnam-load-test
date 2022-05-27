#!/bin/bash
set -aeuo pipefail
echo "----------"
echo "Sending notification to slack..."
ENVIRONMENT=${ENVIRONMENT:-'local'}
REPORTS_DOMAIN=${REPORTS_DOMAIN:-'https://reports.loadtest.kidsloop.vn'}
REPORTS_FILES_LIST=${REPORTS_FILES_LIST:-'png|html'}
echo "ENVIRONMENT: ${ENVIRONMENT}"
echo "REPORTS_DOMAIN: ${REPORTS_DOMAIN}"
echo "REPORTS_FILES_LIST: ${REPORTS_FILES_LIST}"

## not send notification when running run-local.sh
if [ "$ENVIRONMENT" != "local" ]; then
    files_list=($(aws s3 ls --endpoint-url=$STORAGE_ENDPOINT --region $AWS_REGION --recursive s3://$STORAGE_BUCKET/$RUN_TIME-$TEST_NAME/ | egrep "${REPORTS_FILES_LIST}" | awk '{print $4}'))
    rm -f list && touch list
    for file in "${files_list[@]}"
    do
        echo "${file}: ${REPORTS_DOMAIN}/$file " >> list
    done
    text=$(cat list)
    curl -X POST --data-urlencode "payload={\"channel\": \"${SLACK_CHANNEL}\", \"username\": \"nightwatchjs-bot\", \"text\": \"${text}\", \"icon_emoji\": \"${SLACK_EMOJI}\"}" ${SLACK_IMCOMING_WEBHOOK_URL}
fi