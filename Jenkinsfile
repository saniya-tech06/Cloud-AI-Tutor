pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Validate Docker Compose') {
            steps {
                bat 'docker compose --env-file Backend/.env config --quiet'
            }
        }

        stage('Build Docker Images') {
            steps {
                bat 'docker compose --env-file Backend/.env build'
            }
        }
    }

    post {
        success {
            echo 'Cloud AI Tutor pipeline completed successfully.'
        }
        failure {
            echo 'Cloud AI Tutor pipeline failed. Check the stage logs.'
        }
    }
}