'use strict';

const Hapi = require('hapi');
const Config = require('./config');
const Stream = require('./api/stream');

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
        
        let result = Stream.start(encodeURIComponent(request.params.userId));
        return result;
    }
});

// Stream Close Endpoint
server.route({
    method:'GET',
    path:'/stream/stop/{userId}/{streamId}',
    handler:function(request, h) {

        let result = Stream.end(encodeURIComponent(request.params.userId), encodeURIComponent(request.params.streamId));
        return result;
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