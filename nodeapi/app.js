/*eslint-env node*/


var express = require('express'), router = express.Router(),
	http = require('http'), path = require('path'), AWS = require("aws-sdk"),
	config = require('./config'), jwt = require('jsonwebtoken'),
	fs = require('fs'), bodyParser = require('body-parser');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('json spaces', 2);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router);
app.use(express.static(path.join(__dirname, 'public')));

//Define the securitry routing
router.use('/api/authenticate', require('./routes/authentication.js'));
// Quick health check API
router.get('/api/health', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.json({
    status: "ok"
  });
})

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

// ---------------------------------------------------------
// route middleware to authenticate and check token
// ---------------------------------------------------------
router.use(function(req, res, next) {

	// check header or url parameters or post parameters for token
	var token = req.body.token || req.query.token || req.headers['x-access-token'];
  console.log("User access token is: " + token);
	// decode token
	if (token) {

		// verifies secret and checks exp
		jwt.verify(token, config.secret, function(err, decoded) {
			if (err) {
				console.log(JSON.stringify(err));
				//return res.json({ success: false, message: 'Failed to authenticate token.' });
				return res.status(403).send({
					success: false,
					message: 'Failed to authenticate token.'
				});
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;
				next();
			}
		});

	} else {

		// if there is no token
		// return an error
		return res.status(403).send({
			success: false,
			message: 'No token provided.'
		});

	}

});



//Set up API routes
router.use('/api/rigs', require('./routes/drillingrig.js'));
router.use('/api/assets', require('./routes/assets.js'));
router.use('/api/maintenance', require('./routes/maintenance.js'));
router.use('/api/diagnosis', require('./routes/diagnosis.js'));
router.use('/api/parts', require('./routes/assetparts.js'));
router.use('/api/data', require('./routes/storage.js'));

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});
