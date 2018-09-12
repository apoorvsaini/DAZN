2 API endpoints:

1. /stream/start/<userID> to start stream: It will check the current number of streams the user is viewing and give error if user is watching more than 3 streams.

2. /stream/stop/<userID>to stop the stream

Uses MongoDB service (Atlas) to track users and streams

Creates the user, if not already in the database (for now)

## Scaling

Use caches