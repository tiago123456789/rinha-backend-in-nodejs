## About

This is my project version using node.js of rinha de backend

## Technologies

- Node.js
- Javascript
- Fastify
- Postgres(DB)
- Dragonfly(Cache)
- Nginx(Loadbalancer)
- Docker and Docker-compose
- Autocannon to load stress test

## Strategies to improve performance

- Using cluster module in Node.js
- Using trigger to process total of people and prevent execute unnecessary query in Postgres
- Using index to search by id and term in postgresql
- Remove indexs table people because when you have indexs you need insert register on table and indexs tables. So to prevent this I create trigger when insert register on table **people** the trigger insert register **peoples_with_index** and save indexs via database.
- Using Dragonfly as cache because in benchmarch showed on Dragonflydb.io show Dragonfly is more fast comparte Redis, so tested to see if Dragonfly is really fast. WARN: The Dragonfly is more fast.

## Instructions to run project

- Clone project
- Create **.env** file based **.env.example** file.
- Execute command **npm i -g autoconnon** to install lib to load stress test in machine.
- Execute command **docker-compose up -d --build** to create docker containers
- Execute command **docker exec -it rinha-backend-nodejs_api1_1 npx knex migrate:latest --knexfile src/configs/Knexfile.js** to execute database migrations 
- Execute command **autocannon -c 100 -a 3000 -m POST -i ./body.json -H 'Content-Type: application/json' http://localhost:9999/pessoas** to test POST /peoples. OBS: you need to wait little bit until api node.js already ready.
- Execute command **autocannon -c 100 -a 3000 -H 'Content-Type: application/json' http://localhost:9999/pessoas?t=node** to test GET /peoples?t=node. OBS: you need to wait little bit until api node.js already ready.
- Execute command **autocannon -c 100 -a 3000 -H 'Content-Type: application/json' http://localhost:9999/pessoas** to test GET /peoples. OBS: you need to wait little bit until api node.js already ready.
- Execute command **autocannon -c 100 -a 3000 -H 'Content-Type: application/json' http://localhost:9999/contagem-pessoas** to test GET /contagem-pessoas. OBS: you need to wait little bit until api node.js already ready.
- Execute command **autocannon -c 100 -a 3000 -H 'Content-Type: application/json' http://localhost:9999/pessoas/6db21410-031d-408f-9627-389527308bd0** to test GET /pessoas/6db21410-031d-408f-9627-389527308bd0. OBS: you need to wait little bit until api node.js already ready.