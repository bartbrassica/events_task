#!/bin/bash

docker compose exec web flask db migrate -m "$1"
docker compose exec web flask db upgrade
