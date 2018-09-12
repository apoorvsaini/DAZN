const Config = require('../config');
let MongoClient = require('mongodb').MongoClient;

module.exports.start = async function (userId) {
    let promise = new Promise((resolve, reject) => {
        MongoClient.connect(Config.MONGO_URI, { useNewUrlParser: true }, function(err, db) {
            if (err) throw err;
            let dbo = db.db("dazn");
            let query = { user_id: userId};

            dbo.collection("users").findOne(query, function(err, result) {
                if (err) throw err;
                db.close();
                if (result !== null) {
                    // User found, now check the stream
                    resolve('found');
                }
                else {
                    // Create the user
                    resolve('created');
                }
            });
        });
    });
    let result = await promise;
    return result;
};

module.exports.end = function (userId) {
    return 'ended';
};