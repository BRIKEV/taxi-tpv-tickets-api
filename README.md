# taxi-tpv-tickets-api

[![Known Vulnerabilities](https://snyk.io/test/github/BRIKEV/taxi-tpv-tickets-api/badge.svg?targetFile=package.json)](https://snyk.io/test/github/BRIKEV/taxi-tpv-tickets-api?targetFile=package.json)

An API for taxi tickets registration

### Run API

You can run in your machine using these commands

```
npm run start
// or
npm run local
```

**NOTE** In order to run this API you need to add a `.env` file with this structure:

```
CRYPTO_SECRET=<YOUR_CRYPTO_SECRET>
CRYPTO_ALGORITHM=<YOUR_CRYPTO_ALGORITHM>
TOKEN_SECRET=<YOUR_TOKEN_SECRET>
LOAD_USER_EMAIL=<YOUR_LOAD_USER_EMAIL>
LOAD_USER_PASSWORD=<YOUR_LOAD_USER_PASSWORD>
```

**NOTE** You cand add a test user running this command:

```
npm run load
```

### Run tests

```
npm run test
```

## How to contribute

When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.

## Pull Request Process

1. Ensure all the lint process and tests are running.

2. Update the README.md with details of changes to the interface, this includes new environment variables, exposed ports, useful file locations and container parameters.

*Note:* to run the tests execute:

```
npm run test
```
