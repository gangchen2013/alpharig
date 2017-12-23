/*eslint-env node*/


var express = require('express'), router = express.Router(),
	http = require('http'), path = require('path'), AWS = require("aws-sdk"),
	fs = require('fs'), bodyParser = require('body-parser');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('json spaces', 2);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router);
app.use(express.static(path.join(__dirname, 'public')));

//AWS.config.loadFromPath('./config.json');

// simple logger for this router's requests
// all requests to this router will first hit this middleware
router.use(function(req, res, next) {
  console.log('%s %s %s', req.method, req.url, req.path);
  next();
});

// This tells express to route ALL requests through this middleware
// This middleware ends up being a "catch all" error handler
/*app.use(function (err, req, res, next) {
  if (err.msg) {
    res.send(500, { error: err.msg });
  } else {
    res.send(500, { error: '500 - Internal Server Error' });
  }
});
*/

//Set up API routes
router.use('/api/rigs', require('./routes/drillingrig.js'));
router.use('/api/assets', require('./routes/assets.js'));

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});
