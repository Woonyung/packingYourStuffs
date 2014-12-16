var express = require ('express');

var http = require('http');
var fs = require('fs');
var path = require('path');

var app = express();
var mongoose = require('mongoose'); // mongodb
var Trip = require("./models/model.js"); //db model, can access like Model.Trip


app.configure(function(){

  // server port number
  app.set('port', process.env.PORT || 5000);

  //  templates directory to 'views'
  app.set('views', __dirname + '/views');

  // setup template engine - we're using Hogan-Express
  app.set('view engine', 'html');
  app.set('layout','layout');
  app.engine('html', require('hogan-express')); // https://github.com/vol4ok/hogan-express

  app.use(express.favicon());
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use('/public', express.static('public'));
  // app.use(express.static(path.join(__dirname, 'public'))); // doesn't work :(

  // database connection
  app.db = mongoose.connect(process.env.MONGOLAB_URI);
  console.log("connected to database");
  
});	


// if routes are "/" render the index file
app.get('/', function(req, res){
  res.render('index.html');
});

app.get('/:slug',function(req,res){
	var slugToSearch = req.param('slug');
	console.log(slugToSearch);
	Trip.findOne({slug:slugToSearch},function(err,response){
		console.log('found the trip! >>' +response);
		res.render('index.html');
	})
})

var server = http.createServer(app);

var io = require('socket.io')(server);  // Your app passed to socket.io

////// SOCKETS //////
// array of all the people connected
var connectedSockets = [];

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection', 
	// We are given a websocket object in our function
	function (socket) {
	
		console.log("We have a new client: " + socket.id);
		// add to the connectedSockets array
		connectedSockets.push(socket);
		console.log("Users connected: " + connectedSockets.length);
		
		// When this user emits, client side: socket.emit('otherevent',some data);
		socket.on('message', function(data) {
			// Data comes in as whatever was sent, including objects
			console.log("Received: 'message' " + data);
			
			// Send it to all of the clients
			socket.broadcast.emit('message', data);
		});
		
		
		socket.on('SendStuffToPack', function(data){
			console.log("stuff from client: " + data);
			console.log(data);
			//checking, it works
			for ( var purpose in data){
		        for ( var i = 0; i < data[purpose].length; i++){
		            console.log("purpose in stuff: " + data[purpose][i].url);
		        }
    		}
    		//send the same list to all
    		io.sockets.emit('stuffFromServer', data);
		});

		socket.on('saveData',function(data){
			console.log("saving data "+ data);
			var dataToSave = {
				stuffToPack: data,
				slug: getRandomSlug()
			}

			var trip = new Trip(dataToSave);
			trip.save(function(err,response){
				if(err) console.log('we have an error ' + err);
				else console.log('data saved! >> ' + response);
			})
		});

		socket.on('disconnect', function() {
			console.log("Client has disconnected " + socket.id);
			var indexToRemove = connectedSockets.indexOf(socket);
			connectedSockets.splice(indexToRemove, 1);
			console.log("Users connected: " + connectedSockets.length);
		});
	}
);

// returns a random slug (String)
function getRandomSlug(){
	var slug = '';
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for(var i=0;i<5;i++)
		slug += possible.charAt(Math.floor(Math.random() * possible.length));		
	return slug;
}

server.listen(app.get('port'), function(){
	console.log('express server listening on port ' + app.get('port'));
})