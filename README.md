# Event Management System

## Overview

The **Event Management System** is a web application designed to manage events, participants, and meals. 

## Tech Stack

### Backend

- **Python**: Language used for backend development.
- **Flask**: Web framework for building APIs.
- **Flask-JWT-Extended**: JWT-based user authentication.
- **SQLAlchemy**: ORM for database operations.
- **Marshmallow**: For data serialization and validation.

### Frontend

- **React.js**: Frontend library for building the UI.
- **Material-UI**: Styling and component library for a responsive and attractive UI.

### Database

- **PostgreSQL**: Relational database for storing application data.

## Getting Started

### 1. Clone the repository
```bash
git clone git@github.com:bartosseey/events_task.git
cd event-register
```

### 2. Install Docker and compose plugin
```bash
sudo apt install -y ca-certificates curl gnupg lsb-release
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo echo  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

### 3. Create database
```bash
docker exec -it postgres_database psql -U postgres -c "CREATE DATABASE event_inz;"
```

### 4. Adjust .env files

In root folder create .env file, there is .env.example to copy required keys.
Do the same in backend folder.


### 5. Run scripts

If you want to start app simply use:
./start_containers.sh

Stoping containers:
./stop_containers.sh

Restarting containers:
./restart_containers.sh


### 6. Go to localhost:3000
