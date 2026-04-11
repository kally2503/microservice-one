pipeline {
    agent any

    tools {
        maven "Maven-3.9.6"
    }

    options {
        timestamps()
        buildDiscarder logRotator(
            artifactDaysToKeepStr: '',
            artifactNumToKeepStr: '',
            daysToKeepStr: '5',
            numToKeepStr: '2'
        )
        disableConcurrentBuilds()
    }

    stages {

        stage('Clone the repo') {
            steps {
                git branch: 'main',
                    changelog: false,
                    credentialsId: 'Github_credentails',
                    poll: false,
                    url: 'https://github.com/kally2503/microservice-one.git'
            }
        }

        stage('Build the code') {
            steps {
                sh 'mvn clean package -DskipTests'
            }
        }

        stage('Push to JFrog Artifactory') {
            steps {
                script {
                    def server = Artifactory.newServer(
                        url: 'https://trial3wxr3b.jfrog.io/artifactory',
                        credentialsId: 'jfrog-api-token'
                    )

                    def uploadSpec = """{
                        "files": [{
                            "pattern": "target/microservice-one.war",
                            "target": "tech-snapshots/com/kaeliq/microservice-one/1.0-SNAPSHOT/"
                        }]
                    }"""

                    def buildInfo = Artifactory.newBuildInfo()
                    buildInfo.name   = env.JOB_NAME
                    buildInfo.number = env.BUILD_NUMBER

                    server.upload(spec: uploadSpec, buildInfo: buildInfo)
                    server.publishBuildInfo(buildInfo)
                }
            }
        }

    }

    post {
        success {
            echo '✅ WAR pushed to JFrog successfully!'
        }
        failure {
            echo '❌ Build failed - check logs'
        }
        always {
            cleanWs()
        }
    }
}
