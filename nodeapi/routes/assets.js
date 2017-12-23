var express = require('express')
  , router = express.Router()
  , db = require('../dynamodb.js')
  , AWS = require("aws-sdk")
  , async = require('async')
//  , fs = require('fs');

//var docClient = db.DocumentClient;
var table = "DRILLRIGASSET";
var indexName = "assetsByRigId";

// Quick health check API
router.get('/health', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.json({
    status: "ok"
  });
})

// Return all items for a drillrigId
router.get('/rig', function(req, res) {

  console.log("Input rigId is: " + req.query.drillrigId);
  var drillrigId = req.query.drillrigId;
  var params = {
      TableName: table,
      IndexName: indexName,
      KeyConditionExpression: "drillrigId = :input",
      ExpressionAttributeValues: { ":input": drillrigId}
  };

  var assetsResponse;
  res.setHeader('Content-Type', 'application/json');

  async.series([
      function(callback) {

        //Query Database
        db.query(params, function(err, data) {
          if (err) {
              console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
          } else {
              console.log("Get assets succeeded:", JSON.stringify(data, null, 2));
              assetsResponse = data.Items;
              callback();
          }
        });

      }],
      function(err, results) {
        console.log("Write resposne" + JSON.stringify(assetsResponse));
        res.send(JSON.stringify(assetsResponse));
      });

});

router.post('/info', function(req, res) {
  //console.log(JSON.stringify(db));

  console.log("Input data is: " + JSON.stringify(req.body));
  var params = {
      TableName: table,
      Item: {
                "userId": req.body.userId,
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
