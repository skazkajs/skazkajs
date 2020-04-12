#!/usr/bin/env bash

docker rm -f mysql
docker rm -f pg
docker rm -f redis
docker rm -f mongo
docker rm -f localstack
docker rm -f adminer
docker rm -f dynamodbadmin

docker network rm hostnet
