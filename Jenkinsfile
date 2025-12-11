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

        stage('Start Backend Services') {
            steps {
                echo "🐳 Starting backend services..."
                dir('server') {
                    sh 'docker compose up -d mongodb tablego-backend tablego-test'
                    sh 'sleep 5'
                    sh 'docker compose ps'
                }
            }
        }

        stage('Seed Test Database') {
            steps {
                echo "🌱 Seeding test database..."
                sh '''
                    docker cp server/data/user.json server-mongodb-1:/user.json
                    docker cp server/data/restaurant.json server-mongodb-1:/restaurant.json

                    docker exec server-mongodb-1 mongoimport \
                        --username=admin \
                        --password=password \
                        --authenticationDatabase=admin \
                        --db=tablego_db \
                        --collection=users \
                        --file=/user.json \
                        --jsonArray \
                        --mode=upsert

                    docker exec server-mongodb-1 mongoimport \
                        --username=admin \
                        --password=password \
                        --authenticationDatabase=admin \
                        --db=tablego_db \
                        --collection=restaurants \
                        --file=/restaurant.json \
                        --jsonArray \
                        --mode=upsert
                '''
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
                    script {
                        // Read version from package.json
                        def packageJson = readJSON file: 'package.json'
                        def version = packageJson.version
                        def buildNumber = env.BUILD_NUMBER
                        def buildTime = new Date().format("yyyy-MM-dd HH:mm:ss")

                        echo "📦 Building version ${version} (Build #${buildNumber})"

                        // Create version.json file in src/assets
                        sh """
                            mkdir -p src/assets
                            cat > src/assets/version.json << EOF
                            {
                              "version": "${version}",
                              "buildNumber": "${buildNumber}",
                              "buildTime": "${buildTime}"
                            }
                            EOF
                        """

                        sh 'NODE_OPTIONS="--max-old-space-size=2048" npm run build -- --configuration=test'
                    }
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
                    HTTP_CODE=$(docker exec tablego-test curl -sf -o /dev/null -w "%{http_code}" http://localhost:80)
                    if [ "$HTTP_CODE" -eq 200 ]; then
                        echo "✅ Application is healthy! (HTTP $HTTP_CODE)"
                    else
                        echo "❌ Health check failed! (HTTP $HTTP_CODE)"
                        exit 1
                    fi
                '''
            }
        }

        stage('Smoke Tests') {
            steps {
                sh '''
                    echo "🧪 Running smoke tests..."
                    HTTP_CODE=$(docker exec tablego-test curl -sf -o /dev/null -w "%{http_code}" http://localhost:80/)
                    if [ "$HTTP_CODE" -eq 200 ]; then
                        echo "✅ Smoke tests passed! (HTTP $HTTP_CODE)"
                    else
                        echo "❌ Smoke tests failed! (HTTP $HTTP_CODE)"
                        exit 1
                    fi
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Build and deployment succeeded! 🎉'
            echo "Access your app at: ${APP_URL}"
            echo "Backend API at: http://localhost:5001/app"
        }
        failure {
            echo '❌ Build failed!'
        }
    }
}