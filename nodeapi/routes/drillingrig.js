var express = require('express')
  , router = express.Router()
  , db = require('../dynamodb.js')
  , AWS = require("aws-sdk")
  , async = require('async')
//  , fs = require('fs');

//var docClient = db.DocumentClient;
var table = "DRILLRIG";

// Quick health check API
router.get('/health', function(req, res) {
  res.json({
    status: "ok"
  });
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
  res.setHeader('Content-Type', 'application/json');

  async.series([
      function(callback) {

        //Query Database
        db.query(params, function(err, data) {
          if (err) {
              console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
          } else {
              console.log("GetRig succeeded:", JSON.stringify(data, null, 2));
              rigsResponse = data.Items;
              callback();
          }
        });

      }],
      function(err, results) {
        console.log("Write resposne" + JSON.stringify(rigsResponse));
        res.send(JSON.stringify(rigsResponse));
      });

});

router.post('/info', function(req, res) {
  //console.log(JSON.stringify(db));

  console.log("Input data is: " + JSON.stringify(req.body));
  var params = {
      TableName: table,
      Item: {
                "userId": req.body.userId,
                "passwd": req.body.passwd,
                "drillrigId": req.body.drillrigId
              }
  };

  //var rigsResponse;
  res.setHeader('Content-Type', 'application/json');

  async.series([
      function(callback) {

        //Query Database
        db.put(params, function(err, data) {
          if (err) {
              console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
          } else {
              console.log("PutRig succeeded:", JSON.stringify(data, null, 2));
              //rigsResponse = data.Items;
              callback();
          }
        });

      }],
      function(err, results) {
        console.log("Write resposne" + JSON.stringify(results));
        res.send(JSON.stringify({"putSuccess": true}));
      });

});


module.exports = router
