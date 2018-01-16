var express = require('express')
  , router = express.Router()
  , db = require('../dynamodb.js')
  , AWS = require("aws-sdk")
  , async = require('async')
//  , fs = require('fs');

//var docClient = db.DocumentClient;
var table = "ASSETDIAGNOSIS";

// Quick health check API
router.get('/health', function(req, res) {
  res.json({
    status: "ok"
  });
})

router.get('/asset', function(req, res) {
  //console.log(JSON.stringify(db));

  console.log("Input data: " + req.query.assetId + " - " + req.query.assetModelId);
  var assetId = req.query.assetId;
  var assetModelId = req.query.assetModelId;

  var params = {
      TableName: table,
      KeyConditionExpression: "assetId = :assetId and assetModelId = :assetModelId",
      ExpressionAttributeValues: { ":assetId": assetId, ":assetModelId": assetModelId}
  };

  var maintenanceResponse;
  res.setHeader('Content-Type', 'application/json');

  async.series([
      function(callback) {

        //Query Database
        db.query(params, function(err, data) {
          if (err) {
              console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
          } else {
              console.log("Get MaintenanceResponse succeeded:", JSON.stringify(data, null, 2));
              maintenanceResponse = data.Items;
              callback();
          }
        });

      }],
      function(err, results) {
        console.log("Write resposne" + JSON.stringify(maintenanceResponse));
        res.send(JSON.stringify(maintenanceResponse[0]));
      });

});

router.post('/', function(req, res) {
  //console.log(JSON.stringify(db));

  console.log("Input data is: " + JSON.stringify(req.body));
  var params = {
      TableName: table,
      Item: {
              "assetId": req.body.assetId,
              "assetModelId": req.body.assetModelId,
              "content": req.body.content,
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

// Update an item, ideally, It should be an HTTP PUT, used POST here to suite most of the web handling
router.post('/update', function(req, res) {
  //console.log(JSON.stringify(db));

  console.log("Input data is: " + JSON.stringify(req.body));
  var params = {
      TableName: table,
      Key:{
        "assetId": req.body.assetId,
        "assetModelId": req.body.assetModelId
      },
      UpdateExpression: "set content = :content",
      ExpressionAttributeValues: {":content": req.body.content},
      ReturnValues:"UPDATED_NEW"
  };

  //var rigsResponse;
  res.setHeader('Content-Type', 'application/json');

  async.series([
      function(callback) {

        //Query Database
        db.update(params, function(err, data) {
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
        res.send(JSON.stringify({"updateSucess": true}));
      });

});


module.exports = router
