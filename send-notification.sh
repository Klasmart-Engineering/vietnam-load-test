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

files_list=($(aws s3 ls --endpoint-url=$STORAGE_ENDPOINT --region $AWS_REGION --recursive s3://$STORAGE_BUCKET/$RUN_TIME-$TEST_NAME/$PARTICIPANTID | egrep "${REPORTS_FILES_LIST}" | awk '{print $4}'))

## prepare the reports file
rm -f list && touch reports.html
cat <<EOF |  > reports.html
<!DOCTYPE html>
<html>
<title>KidsLoop Nightwatch JS Reports: ${PARTICIPANTID} | ${TEST_NAME}</title>
<body>
EOF

for file in "${files_list[@]}"
do
    echo "<p>"
    echo "<a href="${REPORTS_DOMAIN}/$file">${file}</a><br>" >> reports.html
done

cat <<EOF |  >> reports.html
</body>
</html>
EOF

aws s3 cp --endpoint-url=$STORAGE_ENDPOINT --region $AWS_REGION --recursive reports.html s3://$STORAGE_BUCKET/$RUN_TIME-$TEST_NAME/$PARTICIPANTID/reports.html
curl -X POST --data-urlencode "payload={\"channel\": \"${SLACK_CHANNEL}\", \"username\": \"nightwatchjs-bot\", \"text\": \"${REPORTS_DOMAIN}\/$RUN_TIME-$TEST_NAME\/$PARTICIPANTID\/reports.html\", \"icon_emoji\": \"${SLACK_EMOJI}\"}" ${SLACK_IMCOMING_WEBHOOK_URL}

fi