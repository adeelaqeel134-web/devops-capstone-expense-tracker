# DevOps Capstone — Expense Tracker

A small original web app for the DevOps Essentials individual capstone.

## Features
- Add, view and delete expenses
- PostgreSQL persistence
- Docker + Docker Compose
- GitHub Actions CI/CD
- Ready for Docker Hub and AWS EC2 deployment

## Run with Docker Compose
```bash
docker compose up --build
```
Open http://localhost:3000

Stop and restart:
```bash
docker compose down
docker compose up
```
The named PostgreSQL volume keeps data across this restart.

## GitHub Actions
Create repository secrets:
- DOCKERHUB_USERNAME
- DOCKERHUB_TOKEN

Pushes to main build and push the versioned Docker image.

## Git workflow
Use at least 3 meaningful commits and one feature branch merged through a GitHub Pull Request.

## AWS
Deploy the containerized app to an EC2 instance and expose only the port required by the app in its Security Group.

## Technical decision
PostgreSQL was selected because expenses are structured records and the assignment requires a real database. Docker Compose makes the app/database setup reproducible, while the named volume provides persistence.
