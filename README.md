# Vietnam Load Test (NightwatchJS)

## Run in local (by NPM)

### Installation

Install dependencies:

- `npm i`

### Running

Start test inHouse Live Class:

- `npm run testInHouseStay30MinutesInLive`
- `npm run testInHouseStay30MinutesWithObserveMode`

## Run in Container

- Build Dockerfile: `./build.sh`

- Run container in local. Example: 
  - `./run-local.sh testInHouseStay30MinutesWithObserveMode teacher room123 teacher1`
  - `./run-local.sh testInHouseStay30MinutesWithObserveMode student room123 student1`
  - `./run-local.sh testOutputandLogs student room123 student1`

- Push newversion of container image to ECR
  - Requirement: AWS access with permission to push to KidsLoop ECR
  - increase version number in VERSION
  - `./push-to-ecr.sh`. Or just let [Github Actions](.github/workflows/branch-main.yml) do it

## K8S Set up

[K8S Readme](k8s/)
