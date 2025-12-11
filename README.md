# TableGo

- npm install futtatás
- Docker file
- docker run -d --name tablego_container -p 6000:27017 mongo

Felhasználók beimportálása server/data/user.json fájlból

    - docker cp user.json tablego_container:/user.json
    - docker exec -it tablego_container mongoimport \
        --db=tablego_db \
        --collection=users \
        --file=/user.json \
        --jsonArray

  - docker exec -it tablego_container mongosh

Éttermek beimportálása server/data/restaurant.json fájlból

    - docker cp user.json tablego_container:/restaurant.json
    - docker exec -it tablego_container mongoimport \
      --db=tablego_db \
      --collection=restaurants \
      --file=/restaurant.json \
      --jsonArray

- docker exec -it tablego_container mongosh

- server buildelés: "npx tsc"

- server/package.json -ban található start:all paranccsal elindul a backend és a frontend

******************************************************************************************
******************************************************************************************

# Felhő és DevOps

- A "Programrendszerek fejlesztése" gyakorlat teljesítéséhez MEAN projektet kellett létrehozni (MongoDB, ExpressJS, Angular 2+, NodeJS).
- Ezt a projektet szeretném felhasználni úgy, hogy köré építek egyszerű DevOps folyamatokat.

- server mappában található meg a Dockerfile-ok, amelyekkel fel lehet húzni a szükséges containereket 
```bash
    cd server
    docker compose up -d
```
  - ha sikeresen lefutott a parancs, akkor localhost bizonyos portjain elérhetőek az alábbi szolgáltatások:
    - MongoDB (http://localhost:6000/)
    - Backend API (http://localhost:5001/)
    - Nginx (http://localhost:8081/) (ő az általam szimulált "teszt környezet", ahol a deployolt alkalmazás tud futni)
    - Jenkins (http://localhost:8080/)
    - Grafana (http://localhost:3000/)
    - Prometheus (http://localhost:9090/)

  - Jenkinsben létrehoztam tablego-frontend pipeline-t az alábbi konfigurációval:
    - Definition: Pipeline script from SCM
    - SCM: Git
    - Repository URL: https://github.com/PokrovszkajaKaterina/tablego
    - Branch Specifier: */master
    - Script Path: Jenkinsfile

  - Általam telepített pluginok listája (egy része automatikusan települt Jenkins konfigurációja során, néhányat pedig a buildhez kellett letölteni):
    - Ant Plugin
    - Apache HttpComponents Client 4.x API Plugin
    - ASM API Plugin
    - Bootstrap 5 API Plugin
    - bouncycastle API Plugin
    - Branch API
    - Build Timeout
    - Caffeine API Plugin
    - Checks API plugin
    - Commons Compress API
    - commons-lang3 v3.x Jenkins API
    - commons-text API
    - Config File Provider
    - Credentials
    - Credentials Binding Plugin
    - Dark Theme
    - Display URL API
    - Durable Task
    - ECharts API Plugin
    - EDDSA API Plugin
    - Email Extension Plugin
    - Folders Plugin
    - Font Awesome API Plugin
    - Git
    - Git client
    - GitHub API Plugin
    - GitHub Branch Source Plugin
    - GitHub plugin
    - Gradle Plugin
    - Gson API Plugin
    - Instance Identity
    - Ionicons API
    - Jackson 2 API Plugin
    - Jakarta Activation API
    - Jakarta Mail API
    - Jakarta XML Binding API
    - Java JSON Web Token (JJWT) Plugin
    - JavaBeans Activation Framework (JAF) API
    - JAXB plugin
    - Joda Time API Plugin
    - JQuery3 API Plugin
    - JSON Api Plugin
    - JSON Path API Plugin
    - jsoup API Plugin
    - JUnit Plugin
    - LDAP Plugin
    - Mailer
    - Matrix Authorization Strategy
    - Matrix Project Plugin
    - Metrics Plugin
    - Mina SSHD API :: Common
    - Mina SSHD API :: Core
    - NodeJS
    - OkHttp Plugin
    - OWASP Markup Formatter Plugin
    - Pipeline
    - Pipeline Graph View Plugin
    - Pipeline Utility Steps
    - Pipeline: API
    - Pipeline: Basic Steps
    - Pipeline: Build Step
    - Pipeline: Declarative
    - Pipeline: Declarative Extension Points API
    - Pipeline: GitHub Groovy Libraries
    - Pipeline: Groovy
    - Pipeline: Groovy Libraries
    - Pipeline: Input Step
    - Pipeline: Job
    - Pipeline: Milestone Step
    - Pipeline: Model API
    - Pipeline: Multibranch
    - Pipeline: Nodes and Processes
    - Pipeline: SCM Step
    - Pipeline: Stage Step
    - Pipeline: Stage Tags Metadata
    - Pipeline: Step API
    - Pipeline: Supporting APIs
    - Plain Credentials Plugin
    - Plugin Utilities API Plugin
    - Prism API Plugin
    - Resource Disposer Plugin
    - SCM API
    - Script Security Plugin
    - SnakeYAML API Plugin
    - SSH Build Agents plugin
    - SSH Credentials Plugin
    - Structs
    - Theme Manager
    - Timestamper
    - Token Macro Plugin
    - Trilead API
    - Variant Plugin
    - Workspace Cleanup Plugin