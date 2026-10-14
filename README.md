# Cloud-Based AI Tutor for Personalized Education

A web-based AI learning platform that helps students study through personalized tutoring, document uploads, and interactive learning features.

## Features

- AI-powered tutoring using the Gemini API
- User authentication with JWT
- Study spaces for organizing learning activities
- PDF document uploads and processing
- Interactive quizzes and quiz result tracking
- Chat history and learning assistance
- MySQL database integration

## Technology Stack

**Frontend**
- React
- TypeScript
- Tailwind CSS
- Vite

**Backend**
- Node.js
- Express.js
- JWT authentication
- Gemini API
- PDF processing

**Database**
- MySQL

**DevOps and Tools**
- Git and GitHub
- Docker
- Docker Compose
- Jenkins CI pipeline

## Project Structure

```text
Cloud-AI-Study-Assistant/
├── Backend/
│   ├── src/
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   └── Dockerfile
├── docker-compose.yml
├── Jenkinsfile
└── README.md
```

## Run the Project with Docker

### Prerequisites

- Docker Desktop
- Git

### 1. Clone the repository

```bash
git clone https://github.com/saniya-tech06/Cloud-AI-Tutor.git
cd Cloud-AI-Tutor
```

### 2. Configure environment variables

Create the local environment file using `Backend/.env.example` as a reference. Fill in the required database credentials, Gemini API key, and JWT secret.

Never commit your actual `.env` file or API keys to GitHub.

### 3. Start the application

```bash
docker compose --env-file Backend/.env up -d --build
```

### 4. Access the application

- Frontend: http://localhost
- Backend: http://localhost:5000

To stop the application without deleting database data:

```bash
docker compose --env-file Backend/.env down
```

## Jenkins CI Pipeline

The Jenkins pipeline is defined in `Jenkinsfile` and currently performs these steps:

1. Checks out the GitHub repository.
2. Validates required project files.
3. Builds the backend Docker image.
4. Builds the frontend Docker image.

The pipeline has been tested successfully in Jenkins. A GitHub webhook is configured to trigger builds on push events.

## Environment Variables

Configure the variables required by the backend using `Backend/.env.example`. Actual values must be provided locally and must not be committed to the repository.

## Future Improvements

- Automated testing in the CI pipeline
- Dependency and security vulnerability scanning
- Automated deployment to a cloud platform
- Production monitoring and logging

## Repository

GitHub: https://github.com/saniya-tech06/Cloud-AI-Tutor

---

Developed as a final-year Computer Engineering project.
