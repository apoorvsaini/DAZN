const Config = require('../config');
const Strings = require('../utils/strings');
let MongoClient = require('mongodb').MongoClient;


module.exports.start = async function (userId) {
    let promise = new Promise((resolve, reject) => {
        MongoClient.connect(Config.MONGO_URI, { useNewUrlParser: true }, function(err, db) {
            if (err) throw err;
            let dbo = db.db(Config.MONGODB_COLLECTION);
            let query = { user_id: userId };

            dbo.collection(Strings.USERS).findOne(query, function(err, result) {
                if (err) throw err;
                
                console.log(result);
                console.log(userId);
                
                if (result !== null) {
                    // User found, now check the streams
                    resolve('found');
                    db.close();
                }
                else {
                    // Create the user and a stream
                    var obj = { user_id: userId };
                    dbo.collection(Strings.USERS).insertOne(obj, function(err, res) {
                        if (err) throw err;
                        console.log("1 document inserted");

                        // TODO: now add one to stream collection
                        
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