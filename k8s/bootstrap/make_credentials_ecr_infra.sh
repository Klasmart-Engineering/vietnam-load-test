#!/bin/bash
set +xeuo pipefail

source .env

echo -n "KidsLoop Infra Account: Pull Access Key ID [$current_pull_aws_access_key_id]: "
while read pull_access_key_id; do
  if [[ ! -z "$pull_access_key_id" ]]; then
    break
  elif [[ ! -z "$current_pull_aws_access_key_id" ]]; then
    pull_access_key_id="$current_pull_aws_access_key_id"
    break
  fi
done

echo -n "KidsLoop Infra Account: Pull Secret Access Key [$(echo $current_pull_secret_access_key | cut -b -5)]: "
while read pull_secret_access_key; do
  if [[ ! -z "$pull_secret_access_key" ]]; then
    break
  elif [[ ! -z "$current_pull_secret_access_key" ]]; then
    pull_secret_access_key="$current_pull_secret_access_key"
    break
  fi
done

cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Secret
metadata:
  name: ecr-credentials-infra-pull
  namespace: ${K8S_NAMESPACE}
data:
  aws_access_key_id: $(echo -n $pull_access_key_id | base64)
  secret_access_key: $(echo -n $pull_secret_access_key | base64)
EOF
