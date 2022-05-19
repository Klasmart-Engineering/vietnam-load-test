#!/bin/bash
set +xeuo pipefail

source .env

echo -n "S3 Bucket Access Key ID: "
while read access_key_id; do
  if [[ ! -z "$access_key_id" ]]; then
    break
  fi
done

echo -n "S3 Bucket Secret Access Key: "
while read secret_access_key; do
  if [[ ! -z "$secret_access_key" ]]; then
    break
  fi
done

kubectl create secret generic $S3_SECRET_NAME \
  --dry-run=client \
  -o yaml \
  -n $K8S_NAMESPACE \
  --from-literal=aws-access-key-id="$access_key_id" \
  --from-literal=aws-secret-access-key="$secret_access_key" \
  > $S3_SECRET_NAME.yaml

kubectl delete secret --ignore-not-found=true -n $K8S_NAMESPACE $S3_SECRET_NAME
kubectl apply -f $S3_SECRET_NAME.yaml
  

rm $S3_SECRET_NAME.yaml

