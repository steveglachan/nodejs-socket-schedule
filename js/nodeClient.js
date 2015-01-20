var socket = io.connect( 'http://sg.testing:8080' );

$( "#messageForm" ).submit( function() {
	var nameVal = $( "#nameInput" ).val();
	var msg = $( "#messageInput" ).val();
		
	socket.emit( 'message', { name: nameVal, message: msg } );

	$( "#nameInput" ).val("");
	$( "#messageInput" ).val("");

	// Do other stuff like AJAX POST form contents to server for processing/saving, etc.
	
	return false;
});

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


/* UTILITY FUNCTIONS */

var getFormattedDate = function() {
    var date = new Date();
    var str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    return str;
}