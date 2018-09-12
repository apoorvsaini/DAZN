const Config = require('../config');
const Constants = require('../utils/constants');
let MongoClient = require('mongodb').MongoClient;


module.exports = async function (userId, streamId) {
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