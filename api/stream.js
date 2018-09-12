const Config = require('../config');
const Constants = require('../utils/constants');
let MongoClient = require('mongodb').MongoClient;

/*
    -------------------------- Stream Start Function --------------------------
*/
module.exports.start = async function (userId) {
    let promise = new Promise((resolve, reject) => {
        MongoClient.connect(Config.MONGO_URI, { useNewUrlParser: true }, function(err, db) {
            if (err) throw err;

            let streamCount = 0
            let dbo = db.db(Config.MONGODB_COLLECTION);
            let query = { user_id: userId };
            let streamQuery = { user_id: userId, stream_id: '' };
            let jsonResult = Object.assign({}, Constants.STREAM_RESULT);

            // Pre-populate the stream id
            let random1 = Math.floor((Math.random() * 1000) + 1);
            let random2 = Math.floor((Math.random() * 500) + 1);
            streamQuery['stream_id'] = userId + '_' + random1 + '_' + random2;

            dbo.collection(Constants.USERS).findOne(query, function(err, result) {
                if (err) throw err;       
                
                if (result !== null) {
                    // User found, now check the number streams
                    dbo.collection(Constants.STREAMS).count(query, function(err, result) {
                        if (err) throw err;
                        streamCount = result;

                        if (streamCount >= 3) {
                            jsonResult['status'] = 'error';
                            jsonResult['streams'] = result;
                            jsonResult['message'] = Constants.MAX_STREAMS;

                            resolve(jsonResult);
                        }
                        else {
                            // Add one to stream collection
                            dbo.collection(Constants.STREAMS).insertOne(streamQuery, function(err, result) {
                                if (err) throw err;
                            });

                            db.close();

                            // Build the result
                            jsonResult['status'] = 'success';
                            jsonResult['stream_id'] = streamQuery['stream_id'];
                            jsonResult['streams'] = streamCount + 1;
                            jsonResult['message'] = Constants.STREAM_ADDED;

                            resolve(jsonResult);
                        }
                    });
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
                        jsonResult['status'] = 'success';
                        jsonResult['stream_id'] = streamQuery['stream_id'];
                        jsonResult['streams'] = 1;
                        jsonResult['message'] = Constants.USER_CREATED + ' & ' + Constants.STREAM_ADDED;

                        resolve(jsonResult);
                    });
                }
            });
        });
    });

    let result = await promise;
    return result;
};

/*
    ------------------------------------------------------------------------------
*/


/*
    -------------------------- Stream Start Function --------------------------
*/
module.exports.end = async function (userId, streamId) {
    let promise = new Promise((resolve, reject) => {
        MongoClient.connect(Config.MONGO_URI, { useNewUrlParser: true }, function(err, db) {
            if (err) throw err;
            let dbo = db.db(Config.MONGODB_COLLECTION);
            let query = { user_id: userId, stream_id: streamId };
            let jsonResult = Object.assign({}, Constants.STREAM_RESULT);

            dbo.collection(Constants.STREAMS).findOne(query, function(err, res) {
                if (res === null) {
                    db.close();
                    jsonResult['status'] = 'error';
                    jsonResult['stream_id'] = streamId;
                    jsonResult['streams'] = '';
                    jsonResult['message'] = Constants.WENT_WRONG;
    
                    resolve(jsonResult);
                }
                else {
                    dbo.collection(Constants.STREAMS).deleteOne(query, function(err, res) {
                        if (err) throw err;
                        db.close();
        
                        jsonResult['status'] = 'success';
                        jsonResult['stream_id'] = streamId;
                        jsonResult['streams'] = '';
                        jsonResult['message'] = Constants.STREAM_DELETED;
        
                        resolve(jsonResult);
                        
                    });
                }
            });
        });
    });

    let result = await promise;
    return result;
};

/*
    ------------------------------------------------------------------------------
*/