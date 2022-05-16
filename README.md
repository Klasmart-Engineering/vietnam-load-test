# Vietnam Load Test

### Installation

Install dependencies:

- `npm i`

### Running

Start test inHouse Live Class:

- `npm run testInHouseStay30MinutesInLive`

## Run in Container

Build Dockerfile

- `./build.sh`

Run single container in local

- `./run-local.sh teacher room123 teacher1`
- `./run-local.sh student room123 student1`

Push newversion of container image to ECR

- Requirement: AWS access with permission to push to KidsLoop ECR
- increase version number in VERSION
- `./push-to-ecr.sh`

## K8S Set up

[K8S Readme](k8s/)