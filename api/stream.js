const Config = require('../config');
const Constants = require('../utils/constants');
let MongoClient = require('mongodb').MongoClient;


module.exports.start = async function (userId) {
    let promise = new Promise((resolve, reject) => {
        MongoClient.connect(Config.MONGO_URI, { useNewUrlParser: true }, function(err, db) {
            if (err) throw err;
            let dbo = db.db(Config.MONGODB_COLLECTION);
            let query = { user_id: userId };
            let streamQuery = { user_id: userId, stream_id: '' };

            // Pre-populate the stream id
            let random1 = Math.floor((Math.random() * 100) + 1);
            let random2 = Math.floor((Math.random() * 100) + 1);
            streamQuery['stream_id'] = userId + '_' + random1 + '_' + random2;

            dbo.collection(Constants.USERS).findOne(query, function(err, result) {
                if (err) throw err;       
                
                if (result !== null) {
                    // TODO: User found, now check the number streams
                    dbo.collection(Constants.STREAMS).count(query, function(err, result) {
                        if (err) throw err;
                        
                        if (result >= 3) {
                            let result = Object.assign({}, Constants.STREAM_RESULT);
                            result['status'] = 'error';
                            result['streams'] = result;
                            result['message'] = Constants.MAX_STREAMS;
                            
                            resolve(result);
                        }
                    });

                    // Add one to stream collection
                    dbo.collection(Constants.STREAMS).insertOne(streamQuery, function(err, result) {
                        if (err) throw err;
                    });

                    db.close();

                    // Build the result
                    Constants.STREAM_RESULT['status'] = 'success';
                    Constants.STREAM_RESULT['streams'] = 1;
                    Constants.STREAM_RESULT['stream_id'] = streamQuery['stream_id'];
                    Constants.STREAM_RESULT['message'] = Constants.STREAM_ADDED;
                    resolve(Constants.STREAM_RESULT);
                }
                else {
                    // Create the user and a stream
                    let userobj = { user_id: userId };
                    dbo.collection(Constants.USERS).insertOne(userobj, function(err, res) {
                        if (err) throw err;
                        console.log("1 document inserted");

                        // Add one to stream collection
                        dbo.collection(Constants.STREAMS).insertOne(streamQuery, function(err, result) {
                            if (err) throw err;
                        });
                        
                        db.close();

                        // Build the result
                        Constants.STREAM_RESULT['stream_ids'] = new Array();
                        Constants.STREAM_RESULT['status'] = 'success';
                        Constants.STREAM_RESULT['streams'] = 1;
                        Constants.STREAM_RESULT['stream_id'] = streamQuery['stream_id'];
                        Constants.STREAM_RESULT['message'] = Constants.USER_CREATED + ' ' + Constants.STREAM_ADDED;
                        resolve(Constants.STREAM_RESULT);
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

            dbo.collection(Constants.STREAMS).deleteOne(query, function(err, obj) {
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