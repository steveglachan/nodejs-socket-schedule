var socket = require( 'socket.io' );
var express = require( 'express' );
var http = require( 'http' );
var fs = require( 'fs' );
var schedule = require('node-schedule');

var app = express();
var server = http.createServer( app );
var io = socket.listen( server );

/*
	Web Socket Management
*/

server.listen( 8080 );

io.sockets.on( 'connection', function( client ) {

	// Join Room:
	client.on('join_room', function(room) {
		client.join(room);
		io.sockets.to(room).emit( 'scheduled_message', { name: "Room Joined", message: room } );

		if( room == 'display-units') {
			// Force load scheduled data initially, emitted to 'display-untis' clients only:	
			loadScheduledData();
		}
	})

	// Room specific messages; display the message to other Clients in the same room:
	client.in(client.rooms[0]).on( 'message', function( data ) {
		console.log( 'Message received ' + data.name + ":" + data.message + ". Room: " + client.rooms[0] );
		io.sockets.to(client.rooms[0]).emit( 'message', data );
	});

	// Push data to Clients (display-units) once an Admin has made changes (posted a message in this case):
	client.in('admins').on( 'data_update', function(data) {
		console.log("Client Data Update", data);
		io.sockets.to('display-units').emit( 'scheduled_message', data );
	});

	client.on('disconnect', function() {
		console.info("Client disconnected.");
		io.sockets.emit( 'scheduled_message', { name: "Client Disconnected", message: "A client has disconnected." } );
	});
});

/*
	JSON Data Loading
*/

function loadScheduledData() {
	var dataFile = '../data/scheduled-message.json';
	var data = {};
	fs.readFile(dataFile, 'utf8', function (err, data) {
		if (err) {
			console.log('Error: ' + err);
			return;
		}
		else {
			data = JSON.parse(data);
			io.sockets.in('display-units').emit( 'scheduled_message', data );
		}
	});
};

/*
	Schedule load of JSON data file and push to clients.
	See: https://github.com/mattpat/node-schedule
*/
var j = schedule.scheduleJob('* * * * *', function(){
	loadScheduledData();
});