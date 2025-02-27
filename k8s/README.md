# Run Nightwatch in K8S

## Requirements

- Tools:
  - bash
  - kubectl 
- Credentials:
  - AWS access with permission to pull container images from KidsLoop ECR ( `037865799674` a.k.a `kl-int-data`) 

- Infra:
  - Create new K8S Cluster (EKS, VNGC-K8S, etc.) for NightwatchJS
  - Set up kubectl on local to work with the cluster ( put KUBECONFIG to `~/.kube/config`)

## Bootstrap

Prepare some necessary credentials for K8S jobs

1. Copy `.env.example` to `.env`; edit `.env` for specific usage
2. Create new namespace `./bootstrap/create_namespace.sh`
3. Create ECR credential `./bootstrap/make_secret_ecr_infra.sh`; this is used to make docker-registry secret in the next step
4. Create Image Pull Secret `./bootstrap/make_credentials_ecr_infra.sh`; for the jobs to have permission to pull container images from ECR 
5. Create K8S Secret for AWS S3 Credential: `./bootstrap/make_secret_s3.sh`

Please note the image pull secret has expiration time. Run `./bootstrap/make_credentials_ecr_infra.sh` before every job start or check the [cronjob](https://github.com/KL-Engineering/vietnam-helm/blob/main/k8s/helm/helmfile.d/kidsloop.yaml#L43-L62) in vietnam-helm 

## Start the jobs

- To change the number of participants or the number of concurrent classes, change the values of `CONCURRENT_CLASSES` and `STUDENTS` in `.env` file
- To change the test scenario, change the value of `TEST_NAME` in `.env` file. Default test is `testInHouseStay30MinutesInLive`. All test name could be found at [package.json](../package.json)

```
# TEST
TEST_NAME="testInHouseStay30MinutesInLive"  
## number of teacher = number of classes 
CONCURRENT_CLASSES=1
## if we want to do test with 20 participants per class, set STUDENTS=19
STUDENTS=3
```

- Run `./start_k8s_jobs.sh`; this script will create K8S jobs in NightwatchJS K8S Cluster

## Stop the jobs
 
- `./stop_k8s_jobs.sh`

This stop script finds all the running pods which names match the defined job name & stop it.
The jobs could stop by themselves. This stop script is only used to force stop them.

## Reports

Modify the info of S3 bucket for saving the logs in `.env`


```
# S3
AWS_REGION=ap-southeast-1
STORAGE_ENDPOINT=https://s3.ap-southeast-1.amazonaws.com
STORAGE_BUCKET=loadtest-logs
```

Set `ENVIRONMENT` in `.env` to `local` or unset it will disable Report process.

## LOADERO (Optional)

By default, `LOADERO_ENABLED=false`. Change it to `LOADERO_ENABLED=true` to enable "loadero" participants.

To collect project_id, test_id & group_id, For example:

- Project `KidsLoop` has ID `10560` ( https://app.loadero.com/projects/10560/tests/ )
- Test `[Vietnam] Assistant teacher in Live class (loadtest.kidsloop.vn)` has ID `14341` ( https://app.loadero.com/projects/10560/tests/14341/groups/ )
- The Group ID of test `14341` is `58103` ( https://app.loadero.com/projects/10560/tests/14341/groups/58103/participants/ )

Therefore

```
LOADERO_PROJECT_ID=10560
LOADERO_TEST_ID=14341
LOADERO_GROUP_ID=58103
```

## Misc.

To copy all screenshots from pods to local, try: `./copy_screenshots.sh`.
