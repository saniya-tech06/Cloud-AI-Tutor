pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Validate Project Files') {
            steps {
                sh 'test -f docker-compose.yml'
                sh 'test -f Backend/.env.example'
                sh 'test -f Backend/Dockerfile'
                sh 'test -f frontend/Dockerfile'
                echo 'Required project files are present.'
            }
        }

        stage('Build Docker Images') {
            steps {
                sh 'docker build -t cloud-ai-tutor-backend:ci ./Backend'
                sh 'docker build -t cloud-ai-tutor-frontend:ci ./frontend'
            }
        }
    }

    post {
        success {
            echo 'Cloud AI Tutor CI pipeline completed successfully.'
        }
        failure {
            echo 'Pipeline failed. Check Console Output for details.'
        }
    }
}