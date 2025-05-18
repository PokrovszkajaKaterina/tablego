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

