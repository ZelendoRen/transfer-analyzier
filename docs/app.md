# App Module

This is the root module of the application, responsible for orchestrating and importing all other modules. It also handles application bootstrapping, including setting up middleware, global pipes, Swagger documentation, and starting the server.

## Features

- **Module Aggregation:** Imports and combines all other feature modules.
- **Global Configuration:** Sets up the global configuration module.
- **Scheduling:** Configures the scheduling module for cron jobs.
- **Application Bootstrapping:** Handles application initialization, including middleware, Swagger, and server start.

## Module Configuration

The `AppModule` imports the following modules:

- `ConfigModule`: For loading and managing application configuration.
- `ScheduleModule`: For scheduling tasks using cron jobs.
- `DatabaseModule`: For database interaction.
- `BlockchainModule`: For interacting with the blockchain.
- `AggregatorModule`: For aggregating blockchain data.
- `AnalyzerModule`: For analyzing blockchain data.

## Controllers

- `AppController`: The main application controller (if any endpoints are defined).

## Services

- `AppService`: The main application service (if any shared logic is implemented).

## Bootstrapping Process (`main.ts`)

The `bootstrap` function in `main.ts` performs the following steps:

1. **Create NestJS Application:** Creates a NestJS application instance using `NestFactory.create(AppModule)`.
2. **Enable CORS:** Enables Cross-Origin Resource Sharing using `app.enableCors()`.
3. **Set Global Prefix:** Sets a global API prefix (`api/v1`) using `app.setGlobalPrefix('api/v1')`.
4. **Configure Swagger:**
   - Creates a Swagger `DocumentBuilder` instance to define the API documentation.
   - Adds Bearer authentication to Swagger.
   - Adds the API server.
   - Creates the Swagger document using `SwaggerModule.createDocument(app, config, { ignoreGlobalPrefix: true })`. The `ignoreGlobalPrefix` option makes the Swagger UI display paths without the global prefix.
   - Writes the Swagger specification to a `swagger-spec.json` file.
   - Sets up the Swagger UI at the `/docs` path using `SwaggerModule.setup('docs', app, document)`.
5. **Set Global Pipes:** Sets up a global `ValidationPipe` using `app.useGlobalPipes(new ValidationPipe())`. This pipe automatically validates request payloads based on DTOs.
6. **Start Server:** Starts the application server on the port specified in the environment variable `PORT` or defaults to port 3000 using `app.listen(process.env.PORT ?? 3000)`.

## Swagger Documentation

The application generates Swagger/OpenAPI documentation, which is available at the `/docs` route after the application starts. The documentation is also written to a `swagger-spec.json` file in the project root directory.

## Global Validation Pipe

The application uses a global `ValidationPipe` to automatically validate incoming requests based on the DTOs used in the controllers. This ensures data integrity and reduces boilerplate code in the controllers.

## Configuration

The application uses the `ConfigModule` for configuration. Environment variables or a `.env` file are commonly used to store configuration values.

## Modules Imported

The `AppModule` imports and combines the following modules, effectively making their functionalities available throughout the application:

- `ConfigModule`: Provides access to configuration values.
- `ScheduleModule`: Enables scheduled tasks using cron jobs.
- `DatabaseModule`: Manages the database connection and entity definitions.
- `BlockchainModule`: Provides services for interacting with the blockchain.
- `AggregatorModule`: Implements blockchain data aggregation logic.
- `AnalyzerModule`: Implements blockchain data analysis logic.
