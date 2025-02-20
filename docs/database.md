# Database Module

This module configures and exports the TypeORM module for database interaction. It establishes a connection to a PostgreSQL database using configuration values and defines the entities used in the application.

## Features

- **Database Connection:** Establishes a connection to a PostgreSQL database.
- **Entity Definition:** Defines the database entities (`TransactionsEntity` and `BlocksEntity`).
- **Dependency Injection:** Uses `ConfigService` to inject database configuration.
- **Global Scope:** Makes the TypeORM module globally available.

## Module Configuration

The `DatabaseModule` uses `TypeOrmModule.forRootAsync` to configure the database connection asynchronously. This allows for dependency injection of the `ConfigService`.

- **Imports:** Imports the `ConfigModule` to access configuration values.
- **Inject:** Injects the `ConfigService` into the `useFactory` function.
- **useFactory:** A factory function that returns the TypeORM configuration object.

## Database Configuration

The database connection is configured using the following environment variables:

- `DB_HOST`: The database host.
- `DB_PORT`: The database port.
- `DB_USER`: The database username.
- `DB_PASSWORD`: The database password.
- `DB_NAME`: The database name.

## Entities

The module defines two entities:

### `BlocksEntity`

Represents a block in the blockchain.

| Column         | Type        | Description                                           |
| -------------- | ----------- | ----------------------------------------------------- |
| `blockNumber`  | `bigint`    | The block number (primary key).                       |
| `uploaded`     | `timestamp` | The timestamp when the block data was uploaded.       |
| `executedDate` | `timestamp` | The timestamp when the block was executed.            |
| `transactions` | `OneToMany` | A one-to-many relationship with `TransactionsEntity`. |

### `TransactionsEntity`

Represents a transaction log.

| Column            | Type          | Description                                           |
| ----------------- | ------------- | ----------------------------------------------------- |
| `transactionHash` | `varchar(66)` | The transaction hash (primary key).                   |
| `logIndex`        | `integer`     | The log index within the transaction (primary key).   |
| `blockNumber`     | `bigint`      | The block number associated with the transaction.     |
| `from`            | `varchar(42)` | The "from" address of the transaction (indexed).      |
| `to`              | `varchar(42)` | The "to" address of the transaction (indexed).        |
| `value`           | `numeric(66)` | The value transferred in the transaction (indexed).   |
| `uploaded`        | `timestamp`   | The timestamp when the transaction data was uploaded. |
| `blocks`          | `ManyToOne`   | A many-to-one relationship with `BlocksEntity`.       |

## Exports

The module exports the `TypeOrmModule`, making the TypeORM repositories and connection available to other modules.

## Global Scope

The `@Global()` decorator makes this module globally available, so it doesn't need to be imported in other modules that use TypeORM. This is generally acceptable for a core module like the database module. However, be mindful of the potential for tight coupling when using global modules extensively.
