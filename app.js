/**
 * Express app to serve Angular 2 single page auction site
 * author: Pedro Amaral 
 */

const express = require('express');
const fs = require('fs');
const path = require('path');//object to deal with paths
const favicon = require('serve-favicon');
const jwt = require('express-jwt'); //to deal with authentication based in tokens
const morgan = require('morgan'); // Logs each server request to the console
const cookieParser = require('cookie-parser');
const http = require('http');
const https = require ('https');
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); // to deal with the mongodb database
var databaseUri = 'mongodb://127.0.0.1:27017/local'; // database uri for local mongod installation

var secret = 'this is the secret secret secret 12356'; // same secret as in socket.js and api.js used her to verify the Authorization token

//get the file with the API routes 
const routes = require('./server/routes/api');

//get the file with the socket api code
const socket = require('./server/routes/socket');


const app = express(); //the Ex
app.use(morgan ('dev')); // use developer logs
//parser for POST JSON data
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

//POint static path to dist directory
app.use(express.static(path.join(__dirname, 'dist/auction20')));
app.use (favicon(path.join(__dirname,'dist/auction20/favicon.ico')));

//Set up URIs that require Jwt authentication 
app.use('api/newitem',jwt({secret:secret}));// set up authentication for HTTP requests to "/newitem" url
app.use('api/items',jwt({secret:secret}));// set up authentication for HTTP requests to "/newitem" url

// Set our api routes
app.post('/api/authenticate', routes.Authenticate); //route to deal with the post of the authentication form
app.post('/api/newuser', routes.NewUser); //route to deal with the post of the register form
app.post('/api/newitem', routes.NewItem); //route to deal with the post of the new item form
app.post('/api/unregister', routes.Unregister); //route to deal with the post of a unregistering form
app.get('/api/items', routes.GetItems); //route to deal with the get all items call to the api

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/auction20/index.html'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//connect to the database

mongoose.connect(databaseUri,{useNewUrlParser: true, useUnifiedTopology: true}); // Connects to your MongoDB.  Make sure mongod is running!
mongoose.connection.on('error', function() {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});
mongoose.connection.on('connected', function () {
  console.log('Mongoose connected to ' + databaseUri);
});

//defines the port
const port = '3000';

app.set('port', port);

/**
 * Create HTTPS server using the certificate defined in files cert.pem and key.pem
 */

var options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
}; 

const server = https.createServer(options, app);

/**
* Create websocket listening on the same port as the http server
*/
const io = require('socket.io')(server);
socket.StartSocket(io); // call the StartSocket function in socket module

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () =>  {
    console.log(`API running on http://localhost:${port}`);
    console.log('Express server listening on port ' + app.get('port'));
});