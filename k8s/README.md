# Run Nightwatch in K8S

## Requirements

Tool:
- bash
- kubectl 

Infra:
- Create new K8S Cluster (EKS, VNGC-K8S, etc.)
- Set up kubectl on local to work with the cluster

## Bootstrap

- copy `.env.example` to `.env`
- Create new namespace `./bootstrap/create_namespace.sh`
- Create ECR credential `./bootstrap/make_secret_ecr_infra.sh`
- Create Image Pull Secret `./bootstrap/make_credentials_ecr_infra.sh`. 

Please note the image pull secret has expiration time. Run `./k8s/make_credentials_ecr_infra.sh` before every job start or check the [cronjob](https://github.com/KL-Engineering/vietnam-helm/blob/main/k8s/helm/helmfile.d/kidsloop.yaml#L43-L62) in vietnam-helm 

## Start the jobs

- Change the value of CONCURRENT_CLASSES and STUDENTS in `.env` file
- Run `./runK8SJobs.sh`

## Stop the jobs

- `./stop.sh`