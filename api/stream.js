const Config = require('../config');
let MongoClient = require('mongodb').MongoClient;

module.exports.start = function (userId) {
    MongoClient.connect(Config.MONGO_URI, function(err, db) {
        if (err) throw err;
        let dbo = db.db("dazn");
        let query = { user_id: userId};
        dbo.collection("users").findOne(query, function(err, result) {
            if (err) throw err;

            if (result !== null) {
                // User found, now check the stream
                return 'found';
            }

            db.close();
        });
    });

    return 'started';
};

module.exports.end = function (userId) {
    return 'ended';
};