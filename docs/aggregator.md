# Aggregator Service

This service aggregates blockchain data, including timestamps and transaction logs, using cron jobs for periodic collection and processing.

## Features

- **Timestamp Collection:** Collects timestamps for blocks lacking them.
- **Transaction Data Collection:** Collects and processes transaction logs from the blockchain.
- **Batch Processing:** Processes logs in batches for efficiency.
- **Robust Error Handling:** Implements comprehensive error handling and logging.
- **Scheduled Data Collection:** Employs cron jobs for scheduled data acquisition.

### Cron Schedules

- `collectTimestamps`: Executes every second (`*/1 * * * * *`).
- `collectData`: Executes every 5 seconds (`*/5 * * * * *`).

### Methods

#### `collectTimestamps()`

Collects timestamps for blocks without them. This task addresses the requirement to return the transaction's execution date. As the Get Logs RPC response lacks this information, an additional request to retrieve block data is necessary. To mitigate query spam, this cron job was implemented. The `Blocks` database table stores the block number (PK) and execution date. Because all transactions minted within the same block share the same minted timestamp, each stored transaction corresponds to a row in the `Blocks` table. This cron job retrieves new blocks without an execution date every second, requests the timestamp, and updates the database. Further details on the logic are provided below.

- **Logic:**
  1. Checks if the service is already processing timestamps.
  2. Retrieves a block number without a timestamp.
  3. Fetches the block's minted timestamp from the blockchain.
  4. Persists the execution date for the block in the database.
- **Cron:** `*/1 * * * * *`
- **Throws:** (Document any specific exceptions thrown)

#### `collectData()`

Collects, processes, and persists transaction logs to the database.

- **Logic:**
  1. Checks if the service is already processing transactions.
  2. Retrieves the highest processed block number.
  3. Retrieves transaction logs in batches.
  4. Adds blocks to the database.
  5. Persists transaction data to the database.
- **Cron:** `*/5 * * * * *`
- **Throws:** (Document any specific exceptions thrown)

#### `getLogsData(iterationBatchSize)`

Retrieves transaction logs from the blockchain.

- **Parameters:**
  - `iterationBatchSize`: The batch size for log retrieval.
- **Returns:** An object containing the formatted logs and the end block number.
- **Logic:**
  1. Retrieves the current block number from the blockchain.
  2. Calculates the end block number based on the batch size.
  3. Retrieves logs from the blockchain using `blockchainService.getLogs()`.
  4. Formats the logs using `formatLogs()`.
  5. Implements retry logic with exponential backoff for specific RPC errors (`-32000`).
- **Throws:** `Errors.GetLogs`

#### `formatLogs(logs)`

Formats raw transaction logs.

- **Parameters:**
  - `logs`: An array of raw transaction logs.
- **Returns:** An array of formatted transaction logs.
- **Logic:**
  1. Parses each log using `blockchainService.parseLog()`.
  2. Creates a `FormatedLogType` object for each log.
- **Throws:** `Errors.FormatinLogError`

#### `getLogs(args)`

Retrieves logs from the database.

- **Parameters:**
  - `args`: (Describe the structure of `RequestLogType`)
- **Returns:** An array of `ReturnedLogType` objects.

#### `getTotal(args)`

Retrieves the total transaction count from the database.

- **Parameters:**
  - `args`: (Describe the structure of `RequestLogType`)
- **Returns:** A `TotalParamsResponseType` object or `undefined`.
- **Throws:** `Errors.DataBase`

#### `getTopAccounts(args)`

Retrieves the top accounts from the database.

- **Parameters:**
  - `args`: (Describe the structure of `RequestLogType`)
- **Returns:** An array of `TopAccountsResponseType` objects or `undefined`.
- **Throws:** `Errors.DataBase`

## Error Handling

The service employs custom error enums (`Errors`) for comprehensive error management. Specific errors are caught, logged, and appropriate exceptions are thrown.

## Configuration

The service utilizes `ConfigService` to retrieve configuration parameters, including `BATCH_SIZE`.

## Dependencies

- `blocksService`: (Describe the role of `BlocksService`)
- `transactionsService`: (Describe the role of `TransactionsService`)
- `blockchainService`: (Describe the role of `BlockchainService`)
- `configService`: (Describe the role of `ConfigService`)
