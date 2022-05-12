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

- `./run-local.sh`

Push newversion of container image to ECR

- increase version number in VERSION
- `push-to-ecr.sh`

## K8S Set up

[K8S Readme](k8s/README.md)