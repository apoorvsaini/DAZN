'use strict';

const Hapi = require('hapi');
const Config = require('./config');
const StartStream = require('./api/startStream');
const StopStream = require('./api/stopStream');

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
        
        let result = StartStream(encodeURIComponent(request.params.userId));
        return result;
    }
});

// Stream Close Endpoint
server.route({
    method:'GET',
    path:'/stream/stop/{userId}/{streamId}',
    handler:function(request, h) {

        let result = StopStream(encodeURIComponent(request.params.userId).trim(), encodeURIComponent(request.params.streamId).trim());
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