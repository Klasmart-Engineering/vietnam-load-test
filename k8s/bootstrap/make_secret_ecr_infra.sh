#!/bin/bash
set +xeuo pipefail

source .env

export AWS_DEFAULT_REGION=$ECR_REGION
export AWS_ACCESS_KEY_ID=$(kubectl get secret -n $K8S_NAMESPACE ecr-credentials-infra-pull -o jsonpath='{.data.aws_access_key_id}' | base64 --decode)
export AWS_SECRET_ACCESS_KEY=$(kubectl get secret -n $K8S_NAMESPACE ecr-credentials-infra-pull -o jsonpath='{.data.secret_access_key}' | base64 --decode)

kubectl create secret docker-registry $IMAGE_PULL_SECRET \
    --dry-run=client \
    -o yaml \
    -n $K8S_NAMESPACE \
    --docker-server="${ECR_DOMAIN}" \
    --docker-username=AWS \
    --docker-password="$(aws ecr get-login-password)" \
    --docker-email="foo@bar.com" > ecr-secret.yaml

kubectl delete secret --ignore-not-found=true -n $K8S_NAMESPACE ecr-registry-infra
kubectl apply -f ecr-secret.yaml 

rm ecr-secret.yaml
