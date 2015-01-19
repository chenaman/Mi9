// call the packages we need
var express    = require('express');       
var bodyParser = require('body-parser');	// call json body parser (middleware)

var app        = express();                 

// config body parser to qs library to parse
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// json syntax error handling
app.use(function (err, req, res, next) {
	if (err instanceof SyntaxError) {
		res.json({error: "Could not decode request: JSON parsing failed"});
	} else {
		next();
	}
});

var port = process.env.PORT || 5000;	//specify port  
var parseRoute = express.Router();		// get an instance of the express Router

 parseRoute.get('/', function(req, res) {
     res.json({ message: 'Test to make sure this route works.' });   
 });

// handle any POSTs on the route /api/input
parseRoute.route('/input')
    .post(function(req, res) {
		//grab the payload
        var str = req.body.payload;
		var response = [];
		
		//loop through each entry, apply conditions, create json array
        str.forEach(function(entry) {
			if (entry.drm == true && entry.episodeCount > 0) {
				response.push({image:entry.image.showImage, slug:entry.slug, title:entry.title});
			}
		});
		
		//send back response	
		res.contentType('application/json');
        res.json({response:response});
    }
);

// root path (parent level)
app.use('/api', parseRoute);

// listen for any POSTs
app.listen(port);

