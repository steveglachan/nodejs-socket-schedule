/* [DEPRECATED] */
// Using Express and HTTP:
//const http = require( 'http' );
//const socket = require( 'socket.io' );
//const express = require( 'express' );
//const app = express();
//const server = http.createServer( app );
//const io = socket.listen( server );
//server.listen( 8080 );
/* [END DEPRECATED] */

const fs = require( 'fs' );
const schedule = require('node-schedule');

/* Set up HTTPS: */
const https = require( 'https' );
const serverPort = 2121;
const options = {
	pfx: fs.readFileSync('./cert/my_cert.pfx'), // (Local, self-signed. Not included in this repo.)
	passphrase: 'changethis'
};
const server = https.createServer(options);
const io = require('socket.io')(server);

server.listen( serverPort, function() {
  console.log('Server up and running at %s port', serverPort);
});

/*
Web Socket Management
*/

io.sockets.on( 'connection', function( client ) {

	// Join Room:
	client.on('join_room', function(room) {
		client.join(room);
		io.sockets.to(room).emit( 'scheduled_message', { name: "Room Joined", message: room } );
		if( room == 'display-units') {
			// Force load scheduled data initially, emitted to 'display-untis' clients only:	
			loadScheduledData(client.id);
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

function loadScheduledData(clientId) {
	var dataFile = '../data/scheduled-message.json';
	var data = {};
	fs.readFile(dataFile, 'utf8', function (err, data) {
		if (err) {
			console.log('Error: ' + err);
			return;
		}
		else {
			data = JSON.parse(data);
			if( typeof clientId != 'undefined' ) {
				// Send to specific client/socket
				io.to(clientId).emit( 'scheduled_message', { name: "Initial Data Send", message: "Unscheduled data sent to client for initialisation." } );
			}
			else {
				// Send to all display-units clients/sockets
				io.sockets.in('display-units').emit( 'scheduled_message', data );
			}
			
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
