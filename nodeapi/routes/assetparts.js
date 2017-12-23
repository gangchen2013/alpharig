var express = require('express')
  , router = express.Router()
  , db = require('../dynamodb.js')
  , AWS = require("aws-sdk")
  , async = require('async')
//  , fs = require('fs');

//var docClient = db.DocumentClient;
var table = "ASSETPARTS";
var indexName = "partsByAssetModel";

// Quick health check API
router.get('/health', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.json({
    status: "ok"
  });
})

// Return all items for a drillrigId
router.get('/list', function(req, res) {

  console.log("Input data: " + req.query.assetId + " - " + req.query.assetModelId);
  var assetId = req.query.assetId;
  var assetModelId = req.query.assetModelId;

  var params = {
      TableName: table,
      IndexName: indexName,
      KeyConditionExpression: "assetId = :assetId and assetModelId = :assetModelId",
      ExpressionAttributeValues: { ":assetId": assetId, ":assetModelId": assetModelId}
  };

  var partsResponse;
  res.setHeader('Content-Type', 'application/json');

  async.series([
      function(callback) {

        //Query Database
        db.query(params, function(err, data) {
          if (err) {
              console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
          } else {
              console.log("Get parts succeeded:", JSON.stringify(data, null, 2));
              partsResponse = data.Items;
              callback();
          }
        });

      }],
      function(err, results) {
        console.log("Write resposne" + JSON.stringify(partsResponse));
        res.send(JSON.stringify(partsResponse));
      });

});

router.post('/', function(req, res) {
  //console.log(JSON.stringify(db));

  console.log("Input data is: " + JSON.stringify(req.body));
  var params = {
      TableName: table,
      Item: {
                "partsId": req.body.partsId,
                "assetId": req.body.assetId,
                "assetModelId": req.body.assetModelId,
                "partsNumber": req.body.partsNumber,
                "img": req.body.img,
                "orderCycle": req.body.orderCycle,
                "name": req.body.name
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
              console.log("PutAssets succeeded:", JSON.stringify(data, null, 2));
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
// Update by the partsId only
router.post('/update', function(req, res) {
  //console.log(JSON.stringify(db));

  console.log("Input data is: " + JSON.stringify(req.body));
  var params = {
      TableName: table,
      Key:{
        "partsId": req.body.partsId
      },
      UpdateExpression: "set img = :img, partsNumber = :partsNumber, orderCycle = :orderCycle, #nm = :name",
      ExpressionAttributeNames:{
            "#nm": "name"
        },
      ExpressionAttributeValues: {":img": req.body.img,
                                  ":partsNumber": req.body.partsNumber,
                                  ":orderCycle": req.body.orderCycle,
                                  ":name": req.body.name},
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
