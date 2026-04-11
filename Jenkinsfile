pipeline {
    agent any
   
 tools{
        maven "Maven-3.9.6"
    }
 options {
  timestamps()
  buildDiscarder logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '', daysToKeepStr: '5', numToKeepStr: '2')
  disableConcurrentBuilds()
}
    stages {
        stage('Clone the repo') {
            steps {
              git branch: 'main', changelog: false, credentialsId: 'Github_credentails', poll: false, url: 'https://github.com/MooleMuraliDharaReddy/java-app.git'
            }
        }
        
        
         stage('Build the code') {
            steps {
             sh 'mvn clean install'
            }
        }
        
         stage('Push the artifacts to Nexus') {
            steps {
             nexusArtifactUploader artifacts: [[artifactId: 'Spring3HibernateApp', classifier: '', file: '/var/lib/jenkins/workspace/jenkins-build-and-deploy/target/Spring3HibernateApp.war', type: 'war']], credentialsId: 'Nexus-credentials', groupId: 'Spring3HibernateApp', nexusUrl: '54.173.248.84:8081', nexusVersion: 'nexus3', protocol: 'http', repository: 'maven-snapshots', version: '1.2-SNAPSHOT'
            }
        }
        
        
        stage('Deploy the application in tomcat') {
            steps {
            deploy adapters: [tomcat9(credentialsId: 'Tomcat-credentails', path: '', url: 'http://3.95.5.158:8080')], contextPath: null, war: '**/*.war'
            
            }
        }
        
    }
}
