#!/bin/bash

echo test

docker cp src/.    c05:/usr/local/app/
docker exec c05 npm install
docker restart c05

curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{}'