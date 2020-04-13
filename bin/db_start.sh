#!/usr/bin/env bash

# docker system prune -a

docker network create -d bridge --subnet 192.168.0.0/24 --gateway 192.168.0.1 hostnet

docker run -d --net=hostnet --name mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=skazka mysql:5.6
docker run -d --net=hostnet --name pg -p 5432:5432 -e POSTGRES_USER=root -e POSTGRES_PASSWORD=root -e POSTGRES_DB=skazka postgres:alpine
docker run -d --net=hostnet --name redis -p 6379:6379 redis:alpine
docker run -d --net=hostnet --name mongo -p 27017:27017 mongo
docker run -d --net=hostnet --name localstack -p 4563-4597:4563-4597 -e SERVICES=dynamodb,dynamodbstreams,s3 -e DEFAULT_REGION=us-east-1 localstack/localstack
docker run -d --net=hostnet --name adminer -p 8082:8080 adminer
docker run -d --net=hostnet --name dynamodbadmin -p 8081:8001 -e DYNAMO_ENDPOINT=http://localstack:4569 -e AWS_REGION=us-east-1 evheniy/docker-dynamodb-admin
