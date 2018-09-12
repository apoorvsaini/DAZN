# DAZN

## Pre-requisites

* Node 8+

## Setup

Clone the repository and use the termincal to go to the project's root.

From terminal run the following commands:

> npm i

> npm start

The server will expose the endpoints at http://127.0.0.1:3000. The port can be changed from config.js file.

## API endpoints

1. GET /stream/start/{userId} to start stream: It will check the current number of streams the user is viewing and give error if user is watching more than 3 streams.

2. GET /stream/stop/{userId}/{streamId} to stop the stream

I am using MongoDB clusters (Atlas) with 3 replica nodes to track users and streams

### Why GET

I could have used POST/PUT or DELETE to make appropriate API endpoints but I chose GET as it can be tested easily from your side from browser.

## Structure

    .
    ├── server.js
    ├── package.json              # NPM packages
    ├── config.js                 # Contains IP, PORT and server configs
    ├── utils
    │   └── constants.js          # Contains string and Object constants
    └── api
        └── stream.js             # Modules to execute 'start' or 'stop' streams