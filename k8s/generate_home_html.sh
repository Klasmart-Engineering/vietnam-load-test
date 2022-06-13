#!/bin/bash
set -aeuo pipefail

rm -f index.html
echo "----------"
if [ "$ENVIRONMENT" != "local" ]; then
echo "Download home html from S3..."
aws s3 cp --endpoint-url=$STORAGE_ENDPOINT --region $AWS_REGION s3://$STORAGE_BUCKET/index.html index.html
fi

testNameUrl=$(cat <<-END
<p><a target="_blank" href="${REPORTS_DOMAIN}/$RUN_TIME-$TEST_NAME/index.html">$RUN_TIME-$TEST_NAME</a></p>
END
)

if test -f index.html; then
echo "Append index.html..."
newHtml=$(sed "s#<body>#<body>\n\t\t$testNameUrl#" index.html)
echo "$newHtml" > index.html
else
echo "Create index.html..."
cat <<EOF >> index.html
<!DOCTYPE html>
<html>
    <title>KidsLoop Nightwatch JS Reports Home Page</title>
    <body>
        $testNameUrl
    </body>
</html>
EOF
fi

if [ "$ENVIRONMENT" != "local" ]; then
echo "Upload home html to S3"
aws s3 cp --endpoint-url=$STORAGE_ENDPOINT --region $AWS_REGION index.html s3://$STORAGE_BUCKET/index.html
fi