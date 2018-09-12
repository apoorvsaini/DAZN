const Config = require('../config');
let MongoClient = require('mongodb').MongoClient;

module.exports.start = async function (userId) {
    let promise = new Promise((resolve, reject) => {
        MongoClient.connect(Config.MONGO_URI, { useNewUrlParser: true }, function(err, db) {
            if (err) throw err;
            let dbo = db.db("dazn");
            let query = {user_id: userId};

            dbo.collection("users").findOne(query, function(err, result) {
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
                    resolve('created');
                    db.close();
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
            let dbo = db.db("dazn");
            let query = {user_id: userId, stream_id: streamId};

            dbo.collection("streams").deleteOne(query, function(err, obj) {
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