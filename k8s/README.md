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

- Change the values for the test in `.env` file
```
# TEST
TEST_NAME="testInHouseStay30MinutesInLive"  
## number of teacher = number of classes 
CONCURRENT_CLASSES=1
## if we want to do test with 20 participants per class, set STUDENTS=19
STUDENTS=3
```
Default test is `testInHouseStay30MinutesInLive`
All test name could be found at [package.json](../package.json)
- Run `./runK8SJobs.sh`

## Stop the jobs

- `./stop.sh`