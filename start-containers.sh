#!/bin/bash

SCRIPT_NAME="start-containers.sh"

usage() {
    echo "Usage: $SCRIPT_NAME [-b] [-d]"
    echo "Options:"
    echo "  -b    Build images before starting containers"
    echo "  -d    Rebuild images and remove previous containers and volumes before starting"
    exit 1
}

BUILD=false
DOWN=false

while getopts "bd" opt; do
    case ${opt} in
        b)
            BUILD=true
            ;;
        d)
            DOWN=true
            ;;
        *)
            usage
            ;;
    esac
done

if [ "$DOWN" = true ]; then
    echo "Stopping and removing existing containers, networks, and volumes..."
    docker compose down -v
fi

if [ "$BUILD" = true ] || [ "$DOWN" = true ]; then
    echo "Building Docker images..."
    docker compose build
fi

echo "Starting Docker Compose containers..."
docker compose up -d

echo "Docker Compose containers started. Here is the status:"
docker compose ps
