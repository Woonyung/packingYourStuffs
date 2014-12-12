var express = require ('express');
var http = require('http');
var app = express();

app.set('port', process.env.PORT || 5000);
// serve the public folder
app.use('/public', express.static('public')); 	

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

// if routes are "/" render the index file
app.get('/', function(req, res){
  res.render('index');
});

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
			//checking, it works
			for ( var purpose in data){
		        for ( var i = 0; i < data[purpose].length; i++){
		            console.log("purpose in stuff: " + data[purpose][i].url);
		        }
    		}
    		//send the same list to all
    		io.sockets.emit('stuffFromServer', data);
		});


		socket.on('disconnect', function() {
			console.log("Client has disconnected " + socket.id);
			var indexToRemove = connectedSockets.indexOf(socket);
			connectedSockets.splice(indexToRemove, 1);
			console.log("Users connected: " + connectedSockets.length);
		});
	}
);

server.listen(app.get('port'), function(){
	console.log('express server listening on port ' + app.get('port'));
})