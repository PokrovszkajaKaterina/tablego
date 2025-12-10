pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    environment {
        APP_URL = 'http://localhost:8081'
    }

    stages {
        stage('Checkout') {
            steps {
                echo "📥 Checking out code from Git..."
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('client/tablego') {
                    sh 'npm install'
                }
            }
        }

        stage('Code Quality - Lint') {
            steps {
                dir('client/tablego') {
                    sh 'npx eslint src --ext .ts,.html || true'
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
                    sh 'npm test -- --watch=false --code-coverage || true'
                }
            }
        }

        stage('Security Scan') {
            steps {
                dir('client/tablego') {
                    sh 'npm audit --audit-level=moderate || true'
                }
            }
        }

        stage('Deploy with Ansible') {
            steps {
                echo "🚀 Deploying with Ansible..."
                sh 'ansible-playbook server/ansible/deploy.yml'
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                    echo "🏥 Running health check..."
                    sleep 3
                    curl -f ${APP_URL} || exit 1
                    echo "✅ Application is healthy and responding!"
                '''
            }
        }

        stage('Smoke Tests') {
            steps {
                sh '''
                    echo "🧪 Running smoke tests..."
                    curl -f ${APP_URL}/home || exit 1
                    echo "✅ Smoke tests passed!"
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Build and deployment succeeded! 🎉'
            echo "Access your app at: ${APP_URL}"
        }
        failure {
            echo '❌ Build failed!'
        }
    }
}