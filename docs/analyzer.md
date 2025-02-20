# Analyzer Service

This service is responsible for retrieving and formatting blockchain transaction logs. It interacts with the `BlockchainService` to fetch raw logs and parse them into a structured format.

## Features

- **Log Retrieval:** Fetches raw transaction logs from the blockchain.
- **Log Formatting:** Parses and formats raw logs into a structured `FormatedLogType` format.
- **Error Handling:** Implements error handling and logging for blockchain interactions.

## Methods

#### `getLogs(args)`

Retrieves and formats transaction logs from the blockchain.

- **Parameters:**

  - `args`: An object of type `GetBlockParamsType` specifying the criteria for log retrieval. _(Describe the structure of `GetBlockParamsType` - e.g., `startBlock`, `endBlock`, `topicName`, `address`)_

- **Returns:** A `Promise` that resolves to an array of `FormatedLogType` objects. _(Describe the structure of `FormatedLogType` - e.g., `transactionHash`, `blockNumber`, `logIndex`, `from`, `to`, `value`)_

- **Logic:**

  1. Retrieves raw transaction logs from the blockchain using `this.blockchainService.getLogs(args)`.
  2. Iterates through the raw logs, asynchronously parsing each log using `this.blockchainService.parseLog(log)`.
  3. Transforms each parsed log into a `FormatedLogType` object.
  4. Returns the array of formatted logs.

- **Throws:** `Errors.RPCErrors` if an error occurs during the blockchain interaction or log parsing.

## Error Handling

The service uses the `Errors` enum (specifically `Errors.RPCErrors`) to handle errors encountered during blockchain interactions. Errors are logged using the NestJS `Logger`.

## Dependencies

- `blockchainService`: An instance of the `BlockchainService` used to interact with the blockchain. _(Briefly describe the role of the `BlockchainService` - e.g., provides methods for interacting with the blockchain, including retrieving logs and parsing log data.)_
