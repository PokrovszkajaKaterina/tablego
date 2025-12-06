pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    stages {
        stage('Install Dependencies') {
            steps {
                dir('client/tablego') {
                    sh 'npm install'
                }
            }
        }

        stage('Lint') {
            steps {
                dir('client') {
                    sh 'npm run lint || true'
                }
            }
        }

        stage('Build') {
            steps {
                dir('client') {
                    sh 'npm run build'
                }
            }
        }

        stage('Test') {
            steps {
                dir('client') {
                    sh 'npm test -- --watchAll=false --passWithNoTests'
                }
            }
        }
    }

    post {
        success {
            echo 'Build succeeded! 🎉'
        }
        failure {
            echo 'Build failed! ❌'
        }
    }
}