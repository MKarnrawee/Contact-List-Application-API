# Contact List Application API

## Installation
```shell
# Clone project
$ git clone http://gitlab.prototype.apidevops.io/scb-partner/scb-partner-v1-portal-user.git
$ cd scb-partner-v1-portal-user

# Install dependencies
$ yarn install
```

## Features
- **ES6**: Source codes are written in ECMAScript 2016 (ES6) and conforming to [Airbnb's eslint](https://github.com/airbnb/javascript) standards.
- **REST API**: Exposing APIs via REST using `Restify`.
- **Logging**: Central logger using `winston` that logs into json format with timestamp.
- **Service Discovery**: Automatically registers service to the Consul agent running on app server.
- **Swagger**: Exposing swagger documentation for the particular microservice in JSON format via API.
- **Environments**: Using `pm2` to run on multiple environments via a single `config.json` that consists of configurations from multiple environments.

## Pre-Requisites
* git
* Node.js v6.9.x
* yarn v0.19.x
* eslint v3.x.x


## Local Development
Before you start local development
1. Create a local Database table from the sql folder (userinfo.sql)
2. To run your microservice locall, run it with the environment variable eg. NODE_ENV={environment} KEY={PORTAL_KEY} SECRET={PORTAL_SECRET} nodemon

Make changes to the source code and run linting. Ensure you see "Done in x.xs" without any errors before you commit or deploy to app server.

```shell
# Running linting
$ yarn lint
yarn lint v0.19.1
eslint *.js
✨  Done in 2.04s.

# Run code locally
$ node index.js
```
