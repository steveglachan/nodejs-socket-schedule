// Change to appropriate URL (E.g. https://localhost:2121)
var socket = io.connect( 'https://changeme.local:2121' );

// Join 'display units' client room:
socket.emit('join_room', 'display-units');

socket.on( 'message', function( data ) {
	var actualContent = $( "#messages" ).html();
	var newMsgContent = '<li> <strong>' + data.name + '</strong> : ' + data.message + '</li>';
	var content = newMsgContent + actualContent;
	
	$( "#messages" ).html( content );
});

socket.on( 'scheduled_message', function( data ) {
	var actualContent = $( "#scheduled_messages" ).html();
	var newMsgContent = '<li> <strong>' + data.name +" ("+ getFormattedDate() + ')</strong> : ' + data.message + '</li>';
	var content = newMsgContent + actualContent;
	
	$( "#scheduled_messages" ).html( content );
});

$( "#messageForm" ).submit( function() {
	var nameVal = $( "#nameInput" ).val();
	var msg = $( "#messageInput" ).val();
		
	socket.emit( 'message', { name: nameVal, message: msg } );

	$( "#nameInput" ).val("");
	$( "#messageInput" ).val(""); 

	// Do other stuff like AJAX POST form contents to server for processing/saving, etc.
	
	return false;
});
