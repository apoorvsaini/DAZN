'use strict';

const Hapi = require('hapi');
const Config = require('./config');

// Create a server with a host and port
const server = Hapi.server({
    host: Config.HOST,
    port: Config.PORT
});

/*
    -------------------------- Stream Endpoints --------------------------
*/

// Stream Start Endpoint
server.route({
    method:'GET',
    path:'/stream/start/{userId}',
    handler:function(request, h) {

        return `Hello ${encodeURIComponent(request.params.userId)}!`;
    }
});

// Stream Close Endpoint
server.route({
    method:'GET',
    path:'/stream/stop/{userId}',
    handler:function(request, h) {

        return `STOP ${encodeURIComponent(request.params.userId)}!`;
    }
});

/*
    -----------------------------------------------------------------------
*/

// Start the server
async function start() {
    
    try {
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);
};

start();