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

1. GET /stream/start/{userId} to start stream: It will check the current number of streams the user is viewing and give error if user is watching more than 3 streams. If the userId is not present in users MongoDB collection, the API will create one and add a stream under the user (in streams collection). So you can try it out with random userId.

2. GET /stream/stop/{userId}/{streamId} to stop the stream

I am using MongoDB clusters (Atlas) with 3 replica nodes to track users and streams.

### Why GET

I could have used POST/PUT or DELETE to make appropriate API endpoints but I chose GET as it can be tested easily from your side from browser.

### Response Format

The responses from the API endpoints are in the following format:

> {"status":"success", "streams":1, "stream_id":"1213414921_597_274", "message":"New Stream started succesfully"}

Error responses will follow the same format:

> {"status":"error", "streams":3, "stream_id":"", "message":"Maximum streaming limit reached"}

*status*: will tell if the API call resulted in succesfull execution

*streams*: tell how many streams teh given user is currently watching

*stream_id*: tells the id of the new stream (streamId) that the user is now watching

*message*: gives additional verbose message

## Approach

Right of the bat, I focused on modularizing the service and that is what I did. The endpoints are wrapped in server.js and the logic/controller are written in different modules. The constants and configs are separate too, to bring uniformity in API outputs.

JS Promises are used to the fullest as I am also making calls to MongoDB cluster. In production, MongoDB cluster will be in the same Subnet, so it will be faster than what you are seeing right now.

For deciding the end-points, I assumed that there must be two end-points, one to start the stream and at the same time check if the maximum streaming limit has reached for the user. The second end-point will stop a particular stream (given by streamId) for the user (given by userId).

## Structure

    .
    ├── server.js
    ├── package.json              # NPM packages and dependencies
    ├── config.js                 # Contains IP, PORT and server configs
    ├── utils
    │   └── constants.js          # Contains String and Object constants
    └── api                       # Modules to execute 'start' or 'stop' streams
        └── startStream.js
        └── stopStream.js

## Scaling

Although I am using sharded and multi-node MongoDB cluster and the server that I wrote can scale horizontally as micro-service (use load balancers in front), there are other things that can be done.

* We can containerize it, use Docker
* Use in-memory data-stores like redis to hold current count of running stream for users can be beneficial, although I doubt it will have a great effect as caching is more useful in read-heavy cases, which does not quite fit our problem
* Use master-master replication for the DB, to increase the availability, in case of high amount of requests

## To Do

* A little bit more refractoring
* Containarize the service
* Add exception handlers and add Unit Tests for start, stop and subsequent modules, i.e. for production, it is always important to have TDD based approach, which I did not choose to do for this assignment
