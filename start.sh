#!/bin/bash

docker-compose up -d

echo "Waiting for PubSub Emulator to start..."
attempts=0
max_attempts=10
while ! nc -z localhost 8085; do
  if [ $attempts -eq $max_attempts ]; then
    echo "Failed to connect to PubSub Emulator after $max_attempts attempts. Exiting."
    exit 1
  fi
  attempts=$((attempts + 1))
  sleep 5
done
echo "PubSub Emulator started"

echo "Waiting for 10 seconds to ensure PubSub Emulator is fully initialized..."
sleep 10

cd terraform
terraform init
terraform apply -auto-approve
