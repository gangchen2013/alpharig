var assert = require('chai').assert;
var expect = require('chai').expect;
var request = require('request');

var serviceBaseUrl = "http://tasklistdemo.mybluemix.net";
 
describe('TDD Node Web API', function() {
 
    describe('when requested mock data at /api/task/mock', function() {
        it('should return an array of 5 tasks', function(done) {
 
            var endPoint = serviceBaseUrl + '/api/task/mock';
            request(endPoint, function (error, response, body) {

                var bodyJson = JSON.parse(body);
              
                assert.isNull(error, "should return no error");
                assert.propertyVal(response, 'statusCode', 200);
                assert.isArray(bodyJson, 'returned proper array');
                assert.lengthOf(bodyJson, 4, 'mock array has length of 5');
 
                done();
 
            });
        });
    });
    
    // test the insert API
    
      describe('when post task data at /api/task/list', function() {
        it('should insert the record to cloudant and return the doc', function(done) {
 
            var endPoint = serviceBaseUrl + '/api/task/list';
            var postData = encodeURIComponent('task=test insert task item first unit test on server');
 
            request.post({
                  headers: {
                      'content-type' : 'application/x-www-form-urlencoded',
                      'accept' : 'application/json' 
                  },
                  url:     endPoint,
                  body:    postData
                }, function(error, response, body){
                  
                  console.log(response);
                  expect(error).to.not.be.ok;
                  expect(response).to.have.property('statusCode', 200);
                  done();
            });
        });
    });

    
});
