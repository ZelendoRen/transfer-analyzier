# Repository Module

This module provides data access services (repositories) for interacting with the database. It uses TypeORM to manage database operations for the `BlocksEntity` and `TransactionsEntity`.

## Features

- **Data Access Services:** Provides services for interacting with the `Blocks` and `Transactions` tables.
- **Dependency Injection:** Uses TypeORM's `@InjectRepository` to inject the repositories.
- **Error Handling:** Implements error handling for database operations.

## Module Configuration

The `RepositoryModule` imports the `DatabaseModule` to ensure the database connection is established. It also uses `TypeOrmModule.forFeature` to register the `BlocksEntity` and `TransactionsEntity` with TypeORM.

## Services

### `BlocksService`

Provides data access methods for the `BlocksEntity`.

#### `addBlocks(blocks)`

Adds multiple blocks to the database.

- **Parameters:**
  - `blocks`: An array of `BlocksInsertParamsType` objects representing the blocks to insert. _(Describe the structure of `BlocksInsertParamsType`)_
- **Returns:** A `Promise<void>`.
- **Logic:**
  1. Uses a TypeORM query builder to insert the blocks.
  2. Uses `orIgnore()` to handle potential duplicate entries.
- **Throws:** `Errors.DataBase` if a database error occurs.

#### `setExecutionDate(block)`

Updates the execution date for a specific block.

- **Parameters:**
  - `block`: A `BlocksInsertParamsType` object containing the block number and execution date.
- **Returns:** A `Promise<UpdateResult>`.
- **Logic:**
  1. Uses a TypeORM query builder to update the block's `executedDate`.
- **Throws:** `Errors.DataBase` if a database error occurs.

#### `getBlockWithoutDate()`

Retrieves a block number that does not have an execution date.

- **Returns:** A `Promise<number | undefined>` resolving to the block number or `undefined` if none are found.
- **Logic:**
  1. Uses a TypeORM query builder to select a block number where `executedDate` is `NULL`.
- **Throws:** `Errors.DataBase` if a database error occurs.

### `TransactionsService`

Provides data access methods for the `TransactionsEntity`.

#### `setTransactions(logs)`

Adds multiple transactions to the database.

- **Parameters:**
  - `logs`: An array of `FormatedLogType` objects representing the transactions to insert. _(Describe the structure of `FormatedLogType`)_
- **Returns:** A `Promise<boolean>` indicating success or failure.
- **Logic:**
  1. Logs if there are no logs to insert.
  2. Inserts logs in batches of 1000 for performance.
  3. Uses `orIgnore()` to handle potential duplicate entries.
- **Throws:** `Errors.DataBase` if a database error occurs.

#### `getHighestProcessedBlock()`

Retrieves the highest processed block number.

- **Returns:** A `Promise<number>` resolving to the highest processed block number.
- **Logic:**
  1. Retrieves the `START_BLOCK` value from the configuration.
  2. Queries the database for the maximum `blockNumber` in the `transactions` table.
  3. Returns the larger of the configured `START_BLOCK` or the maximum block number from the database.
- **Throws:** `Errors.DataBase` if a database error occurs.

#### `getLogs(args)`

Retrieves transaction logs from the database based on specified criteria.

- **Parameters:**
  - `args`: A `RequestLogType` object specifying the filter criteria (e.g., `startBlock`, `endBlock`, `startDate`, `endDate`, `from`, `to`, `limit`, `offset`, `order`). _(Describe the structure of `RequestLogType`)_
- **Returns:** A `Promise<ReturnedLogType[]>` resolving to an array of transaction log objects. _(Describe the structure of `ReturnedLogType`)_
- **Logic:**
  1. Constructs a TypeORM query builder with joins and selects relevant fields.
  2. Applies filters based on the provided `args`.
  3. Orders and limits the results.
- **Throws:** `Errors.DataBase` if a database error occurs.

#### `getTotal(args)`

Retrieves aggregated transaction data (total value, transaction count, date range, value range, block number range).

- **Parameters:**
  - `args`: A `RequestLogType` object specifying the filter criteria.
- **Returns:** A `Promise<TotalParamsResponseType | undefined>` resolving to an object containing the aggregated data. _(Describe the structure of `TotalParamsResponseType`)_
- **Logic:**
  1. Constructs a TypeORM query builder with joins and aggregate functions.
  2. Applies filters based on the provided `args`.
- **Throws:** `Errors.DataBase` if a database error occurs.

#### `getTopAccounts(args)`

Retrieves the top accounts based on transaction value and count.

- **Parameters:**
  - `args`: A `RequestLogType` object specifying the filter criteria and sorting options.
- **Returns:** A `Promise<TopAccountsResponseType[]>` resolving to an array of top account objects. _(Describe the structure of `TopAccountsResponseType`)_
- **Logic:**
  1. Constructs a TypeORM query builder with aggregations and grouping.
  2. Applies filters based on the provided `args`.
  3. Orders and limits the results.
- **Throws:** `Errors.DataBase` if a database error occurs.

## Exports

The module exports the `TransactionsService` and `BlocksService`, making them available to other modules.
