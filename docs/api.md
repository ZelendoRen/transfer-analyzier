# Aggregator Controller

This controller provides endpoints for accessing aggregated blockchain data, including transaction logs, total values, and top accounts. It interacts with the `AggregatorService` to retrieve and process this data.

## Features

- **Log Retrieval:** Retrieves transaction logs from the database based on various criteria.
- **Total Value Calculation:** Calculates total transaction values and counts for a given period.
- **Top Account Retrieval:** Retrieves a list of top accounts based on transaction value.
- **Input Validation:** Validates input parameters, including block ranges and date ranges.

## Routes

### `GET /aggregator/logs`

Retrieves transaction logs from the database.

- **Summary:** Get logs
- **Description:** Get contract logs from the database.
- **Request Parameters (Query):** _(Describe all query parameters from `GetLogsRequestDTO` with their types, descriptions, and whether they are required or optional. Include details about the allowed values for enums like `order`. Example below)_
  - `startBlock` (string, optional): Start block number.
  - `endBlock` (string, optional): End block number.
  - `startDate` (string, optional): Start date (ISO 8601 format).
  - `endDate` (string, optional): End date (ISO 8601 format).
  - `from` (string, optional): Filter by "from" address.
  - `to` (string, optional): Filter by "to" address.
  - `limit` (number, optional): Maximum number of results to return.
  - `offset` (number, optional): Number of results to skip.
  - `order` (string, optional): Order direction (`asc` or `desc`).
- **Response:**
  - Status: 200
  - Description: Logs were successfully fetched.
  - Type: `GetLogsQueryResponseDTO` array
  - Example: _(Include a realistic example of the response body)_
- **Throws:** `BadRequestException` if both block range and date range are specified, or if `endBlock` is less than `startBlock`, or `endDate` is before `startDate`.

### `GET /aggregator/total`

Retrieves total transaction values and counts.

- **Summary:** Get Total
- **Description:** Get total transactions and values for all indexed period. Also possible to select a specific period by date in timestamp or block number.
- **Request Parameters (Query):** _(Describe all query parameters from `TotalRequestDTO`)_
  - `startBlock` (string, optional): Start block number.
  - `endBlock` (string, optional): End block number.
  - `startDate` (string, optional): Start date (ISO 8601 format).
  - `endDate` (string, optional): End date (ISO 8601 format).
- **Response:**
  - Status: 200
  - Description: Object with total values for selected or all period.
  - Type: `TotalResponseDTO`
  - Example: _(Include a realistic example of the response body)_
- **Throws:** `BadRequestException` if both block range and date range are specified, or if `endBlock` is less than `startBlock`, or `endDate` is before `startDate`. `BadRequestException` with `Errors.NoData` if no data is found for the given criteria.

### `GET /aggregator/top-accounts`

Retrieves a list of top accounts.

- **Summary:** Get Top Accounts List
- **Description:** Get top accounts by total value of transactions. Also possible to select a specific period by date in timestamp or block number.
- **Request Parameters (Query):** _(Describe all query parameters from `TopAccountsRequestDTO`, including allowed values for `orderBy` and `order`)_
  - `startBlock` (string, optional): Start block number.
  - `endBlock` (string, optional): End block number.
  - `startDate` (string, optional): Start date (ISO 8601 format).
  - `endDate` (string, optional): End date (ISO 8601 format).
  - `limit` (number, optional): Maximum number of results to return.
  - `offset` (number, optional): Number of results to skip.
  - `order` (string, optional): Order direction (`asc` or `desc`).
  - `orderBy` (string, optional): Field to order by (e.g., `value`, `transactions`).
- **Response:**
  - Status: 200
  - Description: List of top accounts.
  - Type: `TopAccountsResponseDTO` array
  - Example: _(Include a realistic example of the response body)_
- **Throws:** `BadRequestException` if both block range and date range are specified, or if `endBlock` is less than `startBlock`, or `endDate` is before `startDate`.

### `GET /analyzer/logs`

Retrieves transaction logs directly from the blockchain.

- **Summary:** Get logs
- **Description:** Directly from blockchain. This endpoint is able to get a maximum of 1000 logs.
- **Request Parameters (Query):** _(Describe all query parameters from `GetLogsRequestDTO` with their types, descriptions, and whether they are required or optional. Example below)_
  - `startBlock` (string, required): The starting block number for log retrieval.
  - `endBlock` (string, optional): The ending block number for log retrieval.
  - `topicName` (string, required): The topic name to filter logs by.
  - `from` (string, optional): Filter by "from" address.
  - `to` (string, optional): Filter by "to" address.
- **Response:**
  - Status: 200
  - Description: Logs successfully fetched.
  - Type: `GetLogsQueryResponseDTO` array
  - Example: _(Include a realistic example of the response body)_
- **Throws:** `BadRequestException` if `endBlock` is less than `startBlock`, or if the required parameters (`startBlock`, `topicName`) are missing. `Errors.GetLogs` if an error occurs during log retrieval.

## Input Validation

The controller uses a `ValidationPipe` to automatically validate incoming requests based on the DTOs (`GetLogsRequestDTO`, `TotalRequestDTO`, `TopAccountsRequestDTO`).

## Error Handling

The controller throws `BadRequestException` for invalid input parameters. The `AggregatorService` may also throw other exceptions (e.g., related to database access).
