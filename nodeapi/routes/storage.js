var express = require('express')
  , router = express.Router()
  , AWS = require("aws-sdk")
  , async = require('async');

const _ = require('lodash');
//  , fs = require('fs');


//Need this trick to set the AWS endpoint
AWS.config.update({
  region: "cn-north-1",
  //s3BucketEndpoint: true, // can't set this parameter, it will confuse AWS S3 client to ignore the Bucket
  endpoint: "https://s3.cn-north-1.amazonaws.com.cn"
});
// Create S3 service object
var s3 = new AWS.S3({apiVersion: '2006-03-01'});
var bucketName = "alpharigdata";

// Quick health check API
router.get('/health', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.json({
    status: "ok"
  });
});

//Stream the images and user manual
router.get('/file', function(req, res, next) {

  // Get file anme
  var filename = req.query.filename;
  console.log("Fetch file: " + filename);
  //console.log("S3 ojbect is: " + JSON.stringify(s3));
  //s3.getObject({Bucket: bucketName, Key: filename}).forwardToExpress(res, next);
  s3.getObject({Bucket: bucketName, Key: filename})
    .createReadStream()
    .on('error', next)
    .pipe(res);

});

module.exports = router
