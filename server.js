'use strict';

const Hapi = require('hapi');
const Config = require('./config');

// Create a server with a host and port
const server = Hapi.server({
    host: Config.HOST,
    port: Config.PORT
});

// Stream Endpoint
server.route({
    method:'GET',
    path:'/start/{userId}',
    handler:function(request, h) {

        return `Hello ${encodeURIComponent(request.params.userId)}!`;
    }
});

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