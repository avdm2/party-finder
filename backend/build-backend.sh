#!/bin/bash

SERVICES_DIR="."

COMPOSE_FILE="docker-compose.yml"

build_service() {
    local service_dir="$1"
    local service_name=$(basename "$service_dir")

    echo "Building $service_name..."

    cd "$service_dir" || exit 1

    ./gradlew build

    if [ $? -ne 0 ]; then
        echo "Failed to build $service_name. Exiting..."
        exit 1
    fi

    docker build . -t partyfinder/"$service_name":latest

    cd - > /dev/null || exit 1
}

services=("auth" "chat" "client-profile" "email" "event" "organizer-channel" "organizer-loyalty" "organizer-profile" "rating-system")

for service in "${services[@]}"; do
    build_service "$SERVICES_DIR/$service"
done

echo "Starting services using docker-compose..."
docker-compose -f "$COMPOSE_FILE" up -d

echo "All services have been built and started successfully."