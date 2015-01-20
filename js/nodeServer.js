var socket = require( 'socket.io' );
var express = require( 'express' );
var http = require( 'http' );
var fs = require( 'fs' );
var schedule = require('node-schedule');

var app = express();
var server = http.createServer( app );
var io = socket.listen( server );

/* Schedule load of JSON data file and push to clients. */
// See: https://github.com/mattpat/node-schedule
var j = schedule.scheduleJob('* * * * *', function(){
	loadScheduledData();
});

io.sockets.on( 'connection', function( client ) {
	console.log( "New client !", client.client.id);
	io.sockets.emit( 'scheduled_message', { name: "New Client Connected", message: "Welcome new client." } );
	
	loadScheduledData();

	client.on( 'message', function( data ) {
		console.log( 'Message received ' + data.name + ":" + data.message );
		io.sockets.emit( 'message', { name: data.name, message: data.message } );
	});
});

server.listen( 8080 );


/* UTILITY FUNCTIONS */

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
			io.sockets.emit( 'scheduled_message', data );
		}
	});
};