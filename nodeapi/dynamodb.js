var AWS = require("aws-sdk");
//var settings = require('./settings.json');
var db;

function connectDatabase() {
    if (!db) {
        // Configure AWS
        AWS.config.update({
            region: "cn-north-1",
            endpoint: "https://dynamodb.cn-north-1.amazonaws.com.cn"   // dynamo db endpoint
        });
        db = new AWS.DynamoDB.DocumentClient();
        //db = new AWS.DynamoDB();
    }
    return db;
}

module.exports = connectDatabase();
