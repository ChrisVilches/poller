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

## Test

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
* Add more polling rules.
* Create a UI.
* Configure request headers (e.g. API key, etc).
* Allow rules to modify the notification message using tokens (e.g. `page contains $count occurrences of "hello world"`). Tokens should be specific to each individual rule.

## Tools Used

* NestJS Framework
* TypeScript
* Jest
* TypeORM
* PostgreSQL
