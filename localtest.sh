#!/bin/bash

echo test

docker cp src/.    c07:/usr/local/app/
docker exec c07 npm install
docker restart c07

curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{"moves":["7g7f","8c8d"]}'