# Analyzer | Agregator service

# Technologies

[![Postgres](https://img.shields.io/badge/Postgres-336B91?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/) [![TypeORM](https://img.shields.io/badge/TypeORM-DD4B39?style=for-the-badge&logo=typeorm&logoColor=white)](https://typeorm.io/) [![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/) [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=000)](https://www.javascript.com/) [![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=000)](https://swagger.io/) [![DTO](https://img.shields.io/badge/DTO-28A745?style=for-the-badge&logo=data-transfer-object&logoColor=white)](https://en.wikipedia.org/wiki/Data_transfer_object)
[![RxJS](https://img.shields.io/badge/RxJS-B51821?style=for-the-badge&logo=reactivex&logoColor=white)](https://rxjs.dev/) [![Ethers.js](https://img.shields.io/badge/Ethers.js-2C3E50?style=for-the-badge&logo=ethers.js&logoColor=white)](https://docs.ethers.io/v5/) [![Avalanche](https://img.shields.io/badge/Avalanche-E84142?style=for-the-badge&logo=avalanche&logoColor=white)](https://www.avax.network/) [![RPC](https://img.shields.io/badge/RPC-A0A0A0?style=for-the-badge&logo=remote-procedure-call&logoColor=white)](https://en.wikipedia.org/wiki/Remote_procedure_call)

# Annotation

1. [Get started](Readme.md)
2. [Architecture overview](Readme.md)
3. [Aggregator Module](docs/aggregator.md)
4. [Analyzer Module](docs/analyzer.md)
5. [Blockchain Module](docs/blockchain.md)
6. [Database Module](docs/database.md)
7. [Repository Module](docs/repository.md)
8. [App Module](docs/app.md)
9. [Api Overview](docs/api.md)

# Get started

## 1. Clone repository

`git clone *this-repo-link*`

## 2. Install dependencies

Use `yarn` or `npm` to install dependencies
`yarn install`
or
`npm i`
Also required to install `postgress` database

## 3. Configuration

Create `.env` file based on `.env.example`. It contain data about listening contract and credentials for database connection

Here provided parameters for USDT Avalanche token
`CONTRACT_ADDRESS=0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E`
`RPC_URL=https://avalanche.public-rpc.com` : It is okay to use any other RPC. This free RPC have block limit for 10 000 blocks per request and nearly 60+ request per minute. Also it is stable
`START_BLOCK=7388829` : is block when contract was deployed. Highly recommend use this value, because in other case some of transactions may missed.
`BATCH_SIZE` : max blocks that will try to sync per request. Default value is 2 000. Here possible to reinitialize it. Notice: not recommended to set it more that 9 000

## 4. Run application

Use `yarn start:dev` or `npm run start:dev`. After this will start service. It will create DB tables and start synchronization. It may take a while. For example, USDC on Avalanche we need to collect transaction history for more than 4 years

## 5. Testing

To run test need to run command `jest test`. At now test are not fully finished (It is my big shame) but I will try to push PR with finished tests ASAP. As was define at task, here is only unit tests.

## 6. API

API docs are available when service running by link `/localhost:port/docs`. By this link hosted swagger docs with all params, that supported and by API requests. Also it contains examples of responses. In root directory define file `swagger-spec.json`. This file generate automatic while application start. It contain all API information.

# Architecture overview

## Structure and modules

I decided to separate all functions that can potentially reuse in different places to separate modules. Also try to group functions by purpose. In fact of this finally structure looks like next:

1. Aggregator Module
2. Analyzer Module
3. Blockchain Module
4. Database Module
5. Repository Module
6. App Module
