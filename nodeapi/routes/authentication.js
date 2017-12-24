var express = require('express')
  , router = express.Router()
  , db = require('../dynamodb.js')
  , AWS = require("aws-sdk")
  , jwt = require('jsonwebtoken')
  , config = require('../config.js')
  , async = require('async')
//  , fs = require('fs');

//var docClient = db.DocumentClient;
var table = "DRILLRIG";

// Quick health check API
router.get('/health', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.json({
    status: "ok"
  });
})

// Login authenticate against database
router.post('/', function(req, res) {
  //console.log(JSON.stringify(db));

  console.log("Input data is: " + JSON.stringify(req.body));
  var userId = req.body.userId;
  var passwd = req.body.passwd;
  var params = {
      TableName: table,
      KeyConditionExpression: "userId = :input",
      ExpressionAttributeValues: { ":input": userId}
  };

  var authResponse;

  res.setHeader('Content-Type', 'application/json');

  async.series([
      function(callback) {

        db.query(params, function(err, data) {
          if (err) {
              console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
          } else {
              console.log("GetUser succeeded:", JSON.stringify(data, null, 2));
              authResponse = data.Items[0];
              callback();
          }
        });

      }],
      function(err, results) {
        console.log("Write resposne" + JSON.stringify(results));
        if (err) throw err;

        if (!authResponse) {
          res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else if (authResponse) {

          // check if password matches
          if (authResponse.passwd != req.body.passwd) {
            res.json({ success: false, message: 'Authentication failed. Wrong password.' });
          } else {

            // if user is found and password is right
            // create a token with only our given payload
            // we don't want to pass in the entire user since that has the password
            const payload = {
              userId: authResponse.userId
            };
                var token = jwt.sign(payload, config.secret, {
                  expiresIn: 86400 // expires in 24 hours
                });
                console.log("Generated token: " + token);
                // return the information including token as JSON
                res.json({
                  success: true,
                  message: 'User Authenticated!',
                  token: token
                });
              }
        }
      });

});


module.exports = router
