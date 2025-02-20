# Blockchain Service

This service provides an abstraction layer for interacting with the blockchain. It uses Ethers.js to connect to an RPC provider, interact with a smart contract, and retrieve blockchain data. It is used by other services to fetch data from the blockchain.

## Features

- **RPC Connection:** Establishes a connection to a JSON-RPC provider.
- **Smart Contract Interaction:** Provides methods for interacting with a specific smart contract (ERC20).
- **Block Data Retrieval:** Retrieves information about blocks, including the current block number and block timestamp.
- **Log Retrieval:** Fetches transaction logs from the blockchain, filtered by address and topic.
- **Log Parsing:** Parses raw transaction logs using the contract ABI.
- **Topic Generation:** Generates topic hashes for filtering logs.
- **Error Handling:** Implements error handling for blockchain interactions.

## Constructor

The constructor initializes the service by:

1. Creating a connection to the JSON-RPC provider using the `RPC_URL` from the configuration.
2. Retrieving the contract address (`CONTRACT_ADDRESS`) from the configuration.
3. Creating an Ethers.js contract instance using the contract address, ABI, and provider.

## Methods

#### `getCurrentBlockNumber()`

Retrieves the current block number from the blockchain.

- **Returns:** A `Promise` that resolves to the current block number (a `number`).
- **Throws:** `Errors.BlockChain` if an error occurs during the RPC call.

#### `parseLog(log)`

Parses a raw transaction log using the contract ABI.

- **Parameters:**
  - `log`: An `ethers.Log` object representing the raw transaction log.
- **Returns:** A `Promise` that resolves to an `ethers.Result` object containing the parsed log arguments, or `undefined` if parsing fails.
- **Throws:** `Errors.BlockChain` if an error occurs during parsing.

#### `getLogs(args)`

Retrieves transaction logs from the blockchain, filtered by address and topic.

- **Parameters:**
  - `args`: An object of type `GetBlockParamsType` specifying the criteria for log retrieval. _(Describe the structure of `GetBlockParamsType` - e.g., `startBlock` (string), `endBlock` (string, optional), `topicName` (string), `address` (string, optional), `filter` (object, optional, with `from` and `to` properties))_
- **Returns:** A `Promise` that resolves to an array of `ethers.Log` objects.
- **Logic:**
  1. Constructs the filter object for the `provider.getLogs` method.
  2. Includes the contract address in the filter.
  3. Converts `startBlock` and `endBlock` to integers. `endBlock` defaults to the current block number if not provided.
  4. Generates the topic filter using `getTopic()`.
  5. Calls `provider.getLogs` with the constructed filter.
- **Throws:** `Errors.BlockChain` if an error occurs during the RPC call.

#### `getBlockMintedTimestamp(blockNumber)`

Retrieves the minted timestamp for a specific block.

- **Parameters:**
  - `blockNumber`: The block number for which to retrieve the timestamp.
- **Returns:** A `Promise` that resolves to the block's timestamp (a `number`).
- **Throws:** `Errors.BlockChain` if an error occurs during the RPC call.

#### `getTopic(topicName, filters)`

Generates the topic hash for filtering logs, including any additional filters.

- **Parameters:**
  - `topicName`: The name of the event for which to get the topic hash.
  - `filters`: An optional array of additional filters (e.g., `from`, `to` addresses).
- **Returns:** A `Promise` that resolves to an array containing the topic hash and any additional filters.
- **Logic:**
  1. Retrieves the topic hash for the event using `this.contract.interface.getEvent(topicName)?.topicHash`.
  2. Throws an error if the topic is not found.
  3. Formats additional filters by zero-padding them.
- **Throws:** `Errors.BlockChain` if an error occurs or if the topic is not found.

## Error Handling

The service uses the `Errors` enum (specifically `Errors.BlockChain`) to handle errors encountered during blockchain interactions. Errors are logged using the NestJS `Logger`.

## Configuration

The service uses `ConfigService` to retrieve configuration values:

- `RPC_URL`: The URL of the JSON-RPC provider.
- `CONTRACT_ADDRESS`: The address of the smart contract.

## Dependencies

- `configService`: An instance of `ConfigService` for accessing configuration values.
