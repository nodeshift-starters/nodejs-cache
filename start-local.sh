#!/bin/bash

echo 'Preparing greeting service'
cd greeting-service && npm install && cd ..

echo 'Preparing name service'
cd name-service && npm install && cd ..

echo 'Launching greeting service';
PORT=8180 NAME_SERVICE_HOST='http://localhost:8081' CACHE_HOST='localhost' ./greeting-service/bin/www > greeting-service.log 2>&1 &
echo $! > greeting-service.pid

echo 'Launching name service';
PORT=8081 CACHE_HOST='localhost' ./name-service/bin/www > name-service.log 2>&1 &
echo $! > name-service.pid
sleep 3
echo 'To stop the servers, run "./shutdown-localhost.sh"'

case "$OSTYPE" in
  darwin*)  open http://localhost:8180 ;;
  linux*)   xdg-open http://localhost:8180 ;;
  *)        echo "unknown: $OSTYPE" ;;
esac
