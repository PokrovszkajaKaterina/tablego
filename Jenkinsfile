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
                dir('client/tablego') {
                    sh 'npm run lint || true'
                }
            }
        }

        stage('Build') {
            steps {
                dir('client/tablego') {
                    sh 'NODE_OPTIONS="--max-old-space-size=2048" npm run build'
                }
            }
        }

        stage('Test') {
            steps {
                dir('client/tablego') {
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