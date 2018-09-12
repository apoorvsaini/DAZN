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

1. GET /stream/start/{userId} to start stream: It will check the current number of streams the user is viewing and give error if user is watching more than 3 streams. If the userId is not present in users collection, the API will create one and a stream under the user (in streams collection)

2. GET /stream/stop/{userId}/{streamId} to stop the stream

I am using MongoDB clusters (Atlas) with 3 replica nodes to track users and streams.

### Why GET

I could have used POST/PUT or DELETE to make appropriate API endpoints but I chose GET as it can be tested easily from your side from browser.

### Response Format

The responses from the API endpoints are in the following format:

> {"status":"success/error", "streams":1, "stream_id":"1213414921_597_274", "message":"New Stream started succesfully"}

## Structure

    .
    ├── server.js
    ├── package.json              # NPM packages
    ├── config.js                 # Contains IP, PORT and server configs
    ├── utils
    │   └── constants.js          # Contains string and Object constants
    └── api
        └── stream.js             # Modules to execute 'start' or 'stop' streams

## Scaling

Although I am using sharded and multi-node MongoDB cluster and the server that I wrote can scale horizontally as micro-service (use load balancers in front), there are other things that can be done.

* We can containerize it, use Docker
* Use in-memory data-stores like redis to hold current count of running stream for users can be beneficial, although I doubt it will have a great effect as caching is more useful in read-heavy cases, which does not quite fit our scope