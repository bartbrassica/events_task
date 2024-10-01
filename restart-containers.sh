#!/bin/bash

SCRIPT_NAME="restart-containers.sh"

usage() {
    echo "Usage: $SCRIPT_NAME [-v]"
    echo "Options:"
    echo "  -v    Remove volumes when restarting containers"
    exit 1
}

REMOVE_VOLUMES=false

while getopts "v" opt; do
    case ${opt} in
        v)
            REMOVE_VOLUMES=true
            ;;
        *)
            usage
            ;;
    esac
done

if [ "$REMOVE_VOLUMES" = true ]; then
    echo "Stopping and removing containers, networks, and volumes..."
    docker compose down -v
else
    echo "Stopping and removing containers and networks..."
    docker compose down
fi

echo "Rebuilding and starting containers..."
docker compose up -d --build

echo "Containers restarted. Here is the status:"
docker compose ps
