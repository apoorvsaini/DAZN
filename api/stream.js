const Config = require('../config');
const Strings = require('../utils/strings');
let MongoClient = require('mongodb').MongoClient;


module.exports.start = async function (userId) {
    let promise = new Promise((resolve, reject) => {
        MongoClient.connect(Config.MONGO_URI, { useNewUrlParser: true }, function(err, db) {
            if (err) throw err;
            let dbo = db.db(Config.MONGODB_COLLECTION);
            let query = streamQuery = { user_id: userId };

            dbo.collection(Strings.USERS).findOne(query, function(err, result) {
                if (err) throw err;

                // Pre-populate the stream id
                streamQuery['stream_id'] = userId + '_' + Math.floor((Math.random() * 100) + 1) + '_' + Math.floor((Math.random() * 100) + 1);
                
                if (result !== null) {
                    // TODO: User found, now check the number streams

                    // Add one to stream collection
                    dbo.collection(Strings.STREAMS).insertOne(streamQuery, function(err, result) {
                        if (err) throw err;
                        console.log("stream id: " + streamQuery['stream_id']);
                    });

                    db.close();
                    resolve('found');
                }
                else {
                    // Create the user and a stream
                    let userobj = { user_id: userId };
                    dbo.collection(Strings.USERS).insertOne(userobj, function(err, res) {
                        if (err) throw err;
                        console.log("1 document inserted");

                        // Add one to stream collection
                        dbo.collection(Strings.STREAMS).insertOne(streamQuery, function(err, result) {
                            if (err) throw err;
                            console.log("stream id: " + streamQuery['stream_id']);
                        });
                        
                        db.close();
                        resolve('created');
                    });
                }
            });
        });
    });

    let result = await promise;
    return result;
};

module.exports.end = async function (userId, streamId) {
    let promise = new Promise((resolve, reject) => {
        MongoClient.connect(Config.MONGO_URI, { useNewUrlParser: true }, function(err, db) {
            if (err) throw err;
            let dbo = db.db(Config.MONGODB_COLLECTION);
            let query = { user_id: userId, stream_id: streamId };

            dbo.collection(Strings.STREAMS).deleteOne(query, function(err, obj) {
                if (err) {
                    resolve('error');
                    db.close();
                }
                else {
                    resolve('deleted');
                    db.close();
                }
            });
        });
    });

    let result = await promise;
    return result;
};