var express = require('express')
  , router = express.Router()
  , db = require('../dynamodb.js')
  , AWS = require("aws-sdk")
  , async = require('async')
//  , fs = require('fs');

//var docClient = db.DocumentClient;
var table = "DRILLRIG";

// Test validation API
router.get('/test', function(req, res) {
  res.send('Hello DrillingRig Service')
})

router.get('/info', function(req, res) {
  //console.log(JSON.stringify(db));

  console.log("Input userid is: " + req.query.userId);
  var userId = req.query.userId;
  var params = {
      TableName: table,
      KeyConditionExpression: "userId = :input",
      ExpressionAttributeValues: { ":input": userId}
  };

  var rigsResponse;
  async.series([
      function(callback) {

        //Query Database
        db.query(params, function(err, data) {
          if (err) {
              console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
          } else {
              console.log("GetRig succeeded:", JSON.stringify(data, null, 2));
              rigsResponse = data;
              callback();
          }
        });

      }],
      function(err, results) {
        console.log("Write resposne" + JSON.stringify(rigsResponse));
        res.send(JSON.stringify(rigsResponse));
      });


})


module.exports = router
