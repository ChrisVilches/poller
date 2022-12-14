# Poller

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## API Documentation

See the documentation generated by Swagger by accessing `http://localhost:3000/api`.

## Test

**Note:** Tests must always be executed serially (using the `--runInBand` flag). The current scripts already include it. This is because the database is dropped after each test case, which must happen synchronously.

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Future Work

* Allow JSON requests.
* (Done ✅) Allow requests where the HTML content is loaded using Javascript.
* (Done ✅) Add more polling rules.
* (Done ✅) Create a UI.
* Configure request headers (e.g. API key, etc).
* (Done ✅) Allow rules to modify the notification message using tokens (e.g. `page contains $count occurrences of "hello world"`). Tokens should be specific to each individual rule.

## Tools Used

* NestJS Framework
* TypeScript
* Jest
* TypeORM
* PostgreSQL
