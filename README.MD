# Universal Digital Signage

<table>
  <tr>
    <td><img src="readme/universal-signage.svg" alt="Readme" width="120" height="120"></td>
    <td><h1>Universal Digital Signage</h1></td>
  </tr>
</table>

The **Universal Digital Signage** web application provides a centralized digital signage solution. It is **device independent**: if the device can display a webpage, it can be used with this solution. We use **Raspberry Pi**.  Content can be uploaded to the server, and playlists can be created online. 

### Features include:

- **Hosts** can be managed individually or in **groups**.
- Playlists can be assigned to device-independent **channels** (marketing, screensavers, etc.).
- Slides can be scheduled for inclusion in a playlist or for expiration.
- Playlist changes can be scheduled.
- Content can be images or videos and is stored on the server.
- Full slide creation online with duration, transition effects, padding/margins, captions.

> This project consists of a database (**MongoDB**), backend API/file-system server (**Node.js**), and frontend web application (**React**). The complete solution is a **multi-container Docker Compose stack** (version 3.9), deployable with a single `docker-compose.yml` file.

## Screenshots

<table>
  <tr>
    <td align="center">
      <a href="screenshots/uds_1.png">
        <img src="screenshots/uds_1.png" width="180" alt="Login Screen">
      </a><br/>
      <sub>Login Screen</sub>
    </td>
    <td align="center">
      <a href="screenshots/uds_channels.png">
        <img src="screenshots/uds_channels.png" width="180" alt="Channels Configuration">
      </a><br/>
      <sub>Channels Configuration</sub>
    </td>
    <td align="center">
      <a href="screenshots/uds_hosts.png">
        <img src="screenshots/uds_hosts.png" width="180" alt="Hosts Configuration">
      </a><br/>
      <sub>Hosts Configuration</sub>
    </td>
    <td align="center">
      <a href="screenshots/uds_groups.png">
        <img src="screenshots/uds_groups.png" width="180" alt="Groups Configuration">
      </a><br/>
      <sub>Groups Configuration</sub>
    </td>
  </tr>

  <tr>
    <td align="center">
      <a href="screenshots/uds_gallery.png">
        <img src="screenshots/uds_gallery.png" width="180" alt="Image Gallery">
      </a><br/>
      <sub>Image Gallery</sub>
    </td>
    <td align="center">
      <a href="screenshots/uds_playlist_view.png">
        <img src="screenshots/uds_playlist_view.png" width="180" alt="View Playlist Screen">
      </a><br/>
      <sub>View Playlist Screen</sub>
    </td>
    <td align="center">
      <a href="screenshots/uds_playlist_create.png">
        <img src="screenshots/uds_playlist_create.png" width="180" alt="Create Playlist Screen">
      </a><br/>
      <sub>Create Playlist Screen</sub>
    </td>
    <td align="center">
      <a href="screenshots/uds_playlist_schedule.png">
        <img src="screenshots/uds_playlist_schedule.png" width="180" alt="Schedule Configuration Screen">
      </a><br/>
      <sub>Schedule Configuration Screen</sub>
    </td>
  </tr>
</table>


## Quick Start To Evaluate the Application
If you want to try out the app quickly, here are the steps to get it up and running:
```bash
git clone git@github.com:divisionbyinfinity/Universal-Digital-Signage.git
cd Universal-Digital-Signage
cp env.example .env # Project Environmental Variables
cd backend
cp env.example .env # Backend Environmental Variables
cd ../frontend
cp env.example .env # Frontend Environmental Variables
cd .. 
docker compose up --build -d
```

Then just open your browser to **http://localhost:3000** and you will see the login screen.
Use the default Administrator account to login:
Email Address: admin@uds
Password: password123

When you login you can change the password on the account by clicking the icon in top right and selecting **Profile**.  Or you can create your own account and delete it: make sure to set the role on the new account to **Admin**.

> You can change the email address and password of the default admin account created by editting the script **mongo-init.js** in the root of the project.

```js
/* ------------------------------------------------------------
   Seed initial admin user (idempotent)
------------------------------------------------------------ */
const ADMIN_EMAIL = "admin@uds";

let adminUser = db.users.findOne({ email: ADMIN_EMAIL });

if (!adminUser) {
  print("👤 Inserting initial admin user");

  const userResult = db.users.insertOne({
    firstName: "Full",
    lastName: "Administrator",
    email: ADMIN_EMAIL,
    password: "$2a$10$lpR7ZoS0NDAKUmQuRth8SOrmh0xor5C/k/8MtfkI4Un.L1b5evoyW",
    bio: "Software Developer",
    role: "admin",
    departmentName: department.name,
    departmentId: department._id
  });
```

<div style="margin-bottom: 2.5rem;"></div>


## Table of Contents
- [Universal Digital Signage](#universal-digital-signage)
    - [Features include:](#features-include)
  - [Screenshots](#screenshots)
  - [Quick Start To Evaluate the Application](#quick-start-to-evaluate-the-application)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
    - [Clone the Repo](#clone-the-repo)
    - [Configuring .env Files](#configuring-env-files)
  - [Docker Compose Overview (version 3.9)](#docker-compose-overview-version-39)
    - [MongoDB](#mongodb)
    - [Backend](#backend)
    - [Frontend](#frontend)
    - [Running the Stack](#running-the-stack)
  - [Backend Details](#backend-details)
    - [Schema](#schema)
    - [Project Structure](#project-structure)
    - [Start Backend](#start-backend)
  - [Frontend Details](#frontend-details)
    - [Start Frontend](#start-frontend)
  - [Database Initialization](#database-initialization)
  - [Swagger API Documentation](#swagger-api-documentation)
- [trouble shoot](#trouble-shoot)
- [Universal-Digital-Signage](#universal-digital-signage-1)

---

## Installation

The recommended way to run the full stack is via **Docker Compose**, which sets up MongoDB, backend, and frontend in one go.

### Clone the Repo
```bash
git clone git@github.com:divisionbyinfinity/Universal-Digital-Signage.git
cd Universal-Digital-Signage
```

### To generate your JWT secret:
```bash
openssl rand -hex 64
```
### Configuring .env Files

**Backend `.env` example:**
```bash
NODE_ENV=local
DB_URL=mongodb://<username>:<password>@<host>:27017/signage?authSource=signage
LOCALHOST=http://localhost:3001/
CDN_URL=http://localhost:3001/
CDN_PATH=./
TEMPLATE_PATH=./templates/index-template.html
JWT_SECRET=dev_jwt_secret
CDN_HOST_PATH=./frontend_build_output
CDN_LOCAL_PATH=./cdn/
PORT=3001
```

**Frontend `.env` example:**
```bash
REACT_APP_ENV=local
REACT_APP_API_URL=http://localhost:3001/api/
REACT_APP_CDN_URL=http://localhost:3001/
REACT_APP_HOST_NAME=http://localhost:3000/
REACT_APP_ALLOW_SMALL_FILE=true
PORT=3000
```

---

## Docker Compose Overview (version 3.9)

**docker-compose.yml** defines the stack with the following services:

### MongoDB
```yaml
mongodb:
  image: ${MONGODB_IMAGE}
  container_name: ${MONGODB_CONTAINER_NAME}
  restart: always
  environment:
    MONGO_INITDB_ROOT_USERNAME: ${MONGO_ROOT_USER}
    MONGO_INITDB_ROOT_PASSWORD: ${MONGO_ROOT_PASSWORD}
    MONGO_APP_ADMIN: ${MONGO_APP_ADMIN}
    MONGO_APP_ADMIN_PWD: ${MONGO_APP_ADMIN_PWD}
  ports:
    - "${MONGO_PORT}:27017"
  volumes:
    - mongodb-data:/data/db
    - ${MONGO_INIT_SCRIPT_PATH}:/docker-entrypoint-initdb.d/mongo-init.js:ro
  networks:
    - uds_network
  healthcheck:
    test: ["CMD-SHELL", "mongosh --username ${MONGO_ROOT_USER} --password ${MONGO_ROOT_PASSWORD} --authenticationDatabase admin --eval 'db.adminCommand(\"ping\")' || exit 1"]
    interval: 5s
    timeout: 5s
    retries: 10
    start_period: 60s
```

### Backend
```yaml
backend:
  build: ${BACKEND_BUILD_CONTEXT}
  container_name: ${BACKEND_CONTAINER_NAME}
  restart: always
  ports:
    - "${BACKEND_PORT}:${BACKEND_PORT}"
  environment:
    NODE_ENV: ${NODE_ENV}
    PORT: ${BACKEND_PORT}
    DB_URL: ${DB_URL}
    LOCALHOST: ${LOCALHOST}
    CDN_URL: ${CDN_URL}
    CDN_PATH: ${CDN_PATH}
    TEMPLATE_PATH: ${TEMPLATE_PATH}
    JWT_SECRET: ${JWT_SECRET}
  volumes:
    - ${CDN_HOST_PATH}:${CDN_CONTAINER_PATH}
  networks:
    - uds_network
  tmpfs:
    - /tmp
  security_opt:
    - no-new-privileges:true
```

### Frontend
```yaml
frontend:
    build:
      context: ./frontend
      args:
        PUBLIC_URL: ${PUBLIC_URL}
    container_name: signage-frontend
    # Mapping ports here is safe; if the container exits in prod, the port just closes
    ports:
      - "${PORT_FRONTEND}:${PORT_FRONTEND}"
    volumes:
      - ${FRONTEND_OUTPUT_HOST_PATH}:${FRONTEND_OUTPUT_CONTAINER_PATH}
    environment:
      NODE_ENV: ${NODE_ENV}
      REACT_APP_API_URL: ${REACT_APP_API_URL}
      REACT_APP_CDN_URL: ${REACT_APP_CDN_URL}
    # Logic: If local, serve files. Otherwise, just copy and exit.
    command: >
      sh -c "cp -r ${FRONTEND_BUILD_CONTAINER_PATH}/* ${FRONTEND_OUTPUT_CONTAINER_PATH}/ && 
             if [ \"$NODE_ENV\" = \"local\" ]; then 
                echo 'Starting local dev server...';
                npx serve -s ${FRONTEND_OUTPUT_CONTAINER_PATH} -l ${PORT_FRONTEND};
             else 
                echo 'Production build copied. Exiting.';
             fi"
    networks:
      - uds_network
```


**Key `.env` values for Docker Compose:**

```bash
# General
BACKEND_PORT=3001
PORT_FRONTEND=3000

# MongoDB
MONGODB_IMAGE=mongo:7.0
MONGODB_CONTAINER_NAME=mongodb
MONGO_ROOT_USER=admin
MONGO_ROOT_PASSWORD=changeme
MONGO_APP_ADMIN=admin
MONGO_APP_ADMIN_PWD=changeme
MONGO_PORT=27017
MONGO_INIT_SCRIPT_PATH=./mongo-init.js

# Backend
NODE_ENV=local
DB_URL=mongodb://admin:changeme@mongodb:27017/signage?authSource=admin
LOCALHOST=http://localhost:3001/
CDN_URL=http://localhost:3001/cdn/
CDN_PATH=./cdn/
TEMPLATE_PATH=./templates/index-template.html
JWT_SECRET=dev_jwt_secret
CDN_HOST_PATH=./frontend_build_output
CDN_CONTAINER_PATH=/app/cdn

# Frontend
REACT_APP_ENV=local
REACT_APP_API_URL=http://localhost:3001/api/
REACT_APP_CDN_URL=http://localhost:3001/cdn/
REACT_APP_HOST_NAME=http://localhost:3000/
#For Production you can set the Public URl to be configure homepage in react app  
PUBLIC_URL = /
REACT_APP_ALLOW_SMALL_FILE=true
FRONTEND_BUILD_CONTAINER_PATH=/app/build
FRONTEND_OUTPUT_HOST_PATH=./frontend_build_output
FRONTEND_OUTPUT_CONTAINER_PATH=/app/build_output
```

**Volumes:**
```yaml
volumes:
  mongodb-data:
```

**Networks:**
```yaml
networks:
  uds_network:
    driver: bridge
```

### Running the Stack
```bash
docker compose --env-file .env up --build -d
```

Or with presets:

```bash
docker compose --env-file .env.project.development up --build -d
```
The example **.env.project.development** and **.env.project.production** in the root of the project use "example.com" for the server name: you would want to change this to match your NGINX config. 

Rebuild only frontend or backend if needed:
```bash
docker compose build frontend
docker compose build backend
```

---

## Backend Details

### Schema
[Backend Schema Diagram](/documentation/universal-digital-signage-drawio.png)

**Entities:**
- Users (Admin, Asset Manager, Standard)
- Departments
- Hosts
- Channels
- Groups
- Playlists
- Image Library
- Scheduler

### Project Structure
```
universal-digital-signage/
├─ backend/
│  ├─ app.js
│  ├─ src/
│  │  ├─ config/
│  │  ├─ helpers/
│  │  ├─ middlewares/
│  │  ├─ models/
│  │  └─ routes/
│  ├─ templates/
│  ├─ Dockerfile
│  ├─ env.example
│  └─ package.json
├─ frontend/
│  ├─ public/
│  ├─ src/
│  │  ├─ apis/
│  │  ├─ components/
│  │  ├─ contexts/
│  │  ├─ helper/
│  │  ├─ pages/
│  │  └─ Routes/
│  ├─ Dockerfile
│  ├─ env.example
│  └─ package.json
├─ documentation/
├─ readme/
├─ docker-compose.yml
├─ mongo-init.js
├─ .env
├─ .env.project.development
└─ .env.project.production
```

### Start Backend
```bash
cd backend
npm install
nohup npm start > ../backend_log.txt 2>&1 &
```

---

## Frontend Details

### Start Frontend
```bash
cd frontend
npm install
nohup npm start > ../frontend_log.txt 2>&1 &
```

---

## Database Initialization
```bash
mongosh
use signage;
```
Create `departments` and `users` collections, then insert initial data.

---

## Swagger API Documentation

- Available only in development mode (`NODE_ENV=local`).
- Access via `http://localhost:3001/api-docs` after starting backend.

---
# MongoDB Backup

## 1. Pre-Migration Steps

* Take the server down temporarily to avoid new data being created during migration:

  ```bash
  # Either stop nginx or bring down Docker Compose
  docker compose down
  ```
* Backup MongoDB and CDN prior to migration so you can restore if needed.

---

## 2. Create Temporary Directories for Backup

### MongoDB Dump Directory

```bash
mkdir mongodbdump
```
## 3. Backup MongoDB

```bash
sudo docker exec -i mongodb \
  mongodump --db signage -u <your_username> -p <your_password> --authenticationDatabase admin --out /dump

sudo docker cp mongodb:/dump ~/mongodump
```

* Verify that the dump is in `~/mongodump`.
* Compress the dump for easier transfer:

```bash
zip -r signage.zip mongodump/dump/signage/*
```

## 8. Restore MongoDB (if needed)

* Copy dump into MongoDB container:

```bash
sudo docker cp ~/mongodump/dump mongodb:/dump
```

* Restore database with override (`--drop`):

```bash
sudo docker exec -i mongodb \
  mongorestore --drop --db signage --username <your_username> --password <your_password> --authenticationDatabase admin /dump/signage
```

* Verify data consistency.


# trouble shoot
check if their is port overap if you are unable to reach to frontend or backend
``` bash
netstat -ano | findstr :3001
```
# Universal-Digital-Signage




