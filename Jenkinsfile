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
                    sh 'npm test -- --watch=false --code-coverage || true'
                }
            }
        }

        stage('Deploy to Test') {
            steps {
                dir('client/tablego') {
                    sh '''
                        echo "Deploying to test environment..."
                        # Copy built files to nginx container
                        docker cp dist/my-first-project/. tablego-test:/usr/share/nginx/html/
                        echo "Deployment complete!"
                    '''
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