pipeline {
    agent any

    tools {
        maven "Maven-3.9.6"
        nodejs "NodeJS-20"
    }

    environment {
        JFROG_URL        = 'https://trial3wxr3b.jfrog.io/artifactory'
        JFROG_CRED_ID    = 'jfrog-api-token'
        GITHUB_CRED_ID   = 'Github_credentails'
        SNAPSHOT_REPO    = 'tech-snapshots'
        RELEASE_REPO     = 'tech-releases'
    }

    options {
        timestamps()
        buildDiscarder logRotator(
            daysToKeepStr: '5',
            numToKeepStr: '5'
        )
        disableConcurrentBuilds()
    }

    stages {

        // ─────────────────────────────────────────────
        //  STAGE 1: Clone
        // ─────────────────────────────────────────────
        stage('Clone Repository') {
            steps {
                git branch: 'main',
                    changelog: true,
                    credentialsId: env.GITHUB_CRED_ID,
                    poll: false,
                    url: 'https://github.com/kally2503/microservice-one.git'
            }
        }

        // ─────────────────────────────────────────────
        //  STAGE 2: Build All Services (Parallel)
        // ─────────────────────────────────────────────
        stage('Build All Services') {
            parallel {

                stage('Build - Java Service') {
                    steps {
                        dir('services/java-service') {
                            sh 'mvn clean package -DskipTests'
                        }
                    }
                }

                stage('Build - Angular App') {
                    steps {
                        dir('services/angular-app') {
                            sh 'npm ci'
                            sh 'npm run build'
                        }
                    }
                }

                stage('Build - Python Service') {
                    steps {
                        dir('services/python-service') {
                            sh '''
                                python3 -m venv venv
                                . venv/bin/activate
                                pip install -r requirements.txt
                            '''
                        }
                    }
                }
            }
        }

        // ─────────────────────────────────────────────
        //  STAGE 3: Test All Services (Parallel)
        // ─────────────────────────────────────────────
        stage('Test All Services') {
            parallel {

                stage('Test - Java Service') {
                    steps {
                        dir('services/java-service') {
                            sh 'mvn test'
                        }
                    }
                    post {
                        always {
                            junit allowEmptyResults: true,
                                 testResults: 'services/java-service/target/surefire-reports/*.xml'
                        }
                    }
                }

                stage('Test - Angular App') {
                    steps {
                        dir('services/angular-app') {
                            sh 'npm run test'
                        }
                    }
                }

                stage('Test - Python Service') {
                    steps {
                        dir('services/python-service') {
                            sh '''
                                . venv/bin/activate
                                pytest tests/ --junitxml=reports/test-results.xml --cov=app --cov-report=xml:reports/coverage.xml
                            '''
                        }
                    }
                    post {
                        always {
                            junit allowEmptyResults: true,
                                 testResults: 'services/python-service/reports/test-results.xml'
                        }
                    }
                }
            }
        }

        // ─────────────────────────────────────────────
        //  STAGE 4: Package Artifacts
        // ─────────────────────────────────────────────
        stage('Package Artifacts') {
            parallel {

                stage('Package - Java JAR') {
                    steps {
                        dir('services/java-service') {
                            sh 'mvn package -DskipTests'
                        }
                    }
                }

                stage('Package - Angular Dist') {
                    steps {
                        dir('services/angular-app') {
                            sh 'tar -czf angular-app-${BUILD_NUMBER}.tar.gz -C dist/angular-app/browser .'
                        }
                    }
                }

                stage('Package - Python') {
                    steps {
                        dir('services/python-service') {
                            sh 'tar -czf python-service-${BUILD_NUMBER}.tar.gz app/ requirements.txt setup.cfg'
                        }
                    }
                }
            }
        }

        // ─────────────────────────────────────────────
        //  STAGE 5: Push to JFrog Artifactory
        // ─────────────────────────────────────────────
        stage('Push to JFrog Artifactory') {
            steps {
                script {
                    def server = Artifactory.newServer(
                        url: env.JFROG_URL,
                        credentialsId: env.JFROG_CRED_ID
                    )

                    def uploadSpec = """{
                        "files": [
                            {
                                "pattern": "services/java-service/target/java-service.jar",
                                "target": "${SNAPSHOT_REPO}/com/kaeliq/java-service/${BUILD_NUMBER}/"
                            },
                            {
                                "pattern": "services/angular-app/angular-app-${BUILD_NUMBER}.tar.gz",
                                "target": "${SNAPSHOT_REPO}/com/kaeliq/angular-app/${BUILD_NUMBER}/"
                            },
                            {
                                "pattern": "services/python-service/python-service-${BUILD_NUMBER}.tar.gz",
                                "target": "${SNAPSHOT_REPO}/com/kaeliq/python-service/${BUILD_NUMBER}/"
                            }
                        ]
                    }"""

                    def buildInfo = Artifactory.newBuildInfo()
                    buildInfo.name   = env.JOB_NAME
                    buildInfo.number = env.BUILD_NUMBER

                    server.upload(spec: uploadSpec, buildInfo: buildInfo)
                    server.publishBuildInfo(buildInfo)
                }
            }
        }

        // ─────────────────────────────────────────────
        //  STAGE 6: Build Docker Images
        // ─────────────────────────────────────────────
        stage('Build Docker Images') {
            parallel {

                stage('Docker - Java Service') {
                    steps {
                        dir('services/java-service') {
                            sh "docker build -t kaeliq/java-service:${BUILD_NUMBER} ."
                            sh "docker tag kaeliq/java-service:${BUILD_NUMBER} kaeliq/java-service:latest"
                        }
                    }
                }

                stage('Docker - Angular App') {
                    steps {
                        dir('services/angular-app') {
                            sh "docker build -t kaeliq/angular-app:${BUILD_NUMBER} ."
                            sh "docker tag kaeliq/angular-app:${BUILD_NUMBER} kaeliq/angular-app:latest"
                        }
                    }
                }

                stage('Docker - Python Service') {
                    steps {
                        dir('services/python-service') {
                            sh "docker build -t kaeliq/python-service:${BUILD_NUMBER} ."
                            sh "docker tag kaeliq/python-service:${BUILD_NUMBER} kaeliq/python-service:latest"
                        }
                    }
                }
            }
        }

        // ─────────────────────────────────────────────
        //  STAGE 7: Deploy (Docker Compose)
        // ─────────────────────────────────────────────
        stage('Deploy') {
            steps {
                sh 'docker compose down || true'
                sh 'docker compose up -d'
                sh 'sleep 10'
                sh 'docker compose ps'
            }
        }

        // ─────────────────────────────────────────────
        //  STAGE 8: Smoke Tests
        // ─────────────────────────────────────────────
        stage('Smoke Tests') {
            steps {
                sh '''
                    echo "Testing Java Service..."
                    curl -sf http://localhost:8081/api/health || exit 1

                    echo "Testing Python Service..."
                    curl -sf http://localhost:5000/api/health || exit 1

                    echo "Testing Angular App..."
                    curl -sf http://localhost:4200 || exit 1

                    echo "All smoke tests passed!"
                '''
            }
        }
    }

    post {
        success {
            echo '=== CI/CD Pipeline completed successfully! ==='
            echo "Java Service   : kaeliq/java-service:${BUILD_NUMBER}"
            echo "Angular App    : kaeliq/angular-app:${BUILD_NUMBER}"
            echo "Python Service : kaeliq/python-service:${BUILD_NUMBER}"
        }
        failure {
            echo '=== Pipeline FAILED - check logs above ==='
        }
        always {
            cleanWs()
        }
    }
}
