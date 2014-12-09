// connects to the same page that the page was served from
var socket = io();

socket.on('connect', function(){
	console.log("connected");
});

