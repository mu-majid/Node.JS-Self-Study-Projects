const mongoClient = require('mongodb').MongoClient;
const DB_URL = require("../Configuration/config").DB_URL;
const DbName = require("../Configuration/config").DbName;

var _dbObject;

module.exports = {
    connectToMongoServer: (cb) => {
        mongoClient.connect(DB_URL, (err, client) => {
            _dbObject = client.db(DbName);
            console.log("MongoDB Connected ...");
            return cb(err);
        });
    },
    getDB: () => {
        return _dbObject;
    }
}


