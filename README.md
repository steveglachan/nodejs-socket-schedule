Integration test between NodeJS, Express, Socket.io and a node-schedule module.

This is just a simple (test) application, showing off chat-like functionality along with scheduled pushing of data from server to client(s).
NodeJS is used for realtime refresh.

Essentially this is a proof of concept type project and a way for me to start learning NodeJS and Socket.ioSocket.io and store notes as I go.

*Quick Start Tips*

1. Install NodeJS: http://nodejs.org/download/
  1.Note: You may need to restart your PC if you are installing on Windows
2. Node module have been included in this repo but to install them using NPM. These commands will install the modules in a 'node-modules' directory under the directly you are running the command in.
  1. Socket.io: `> npm install socket.io`
  2. Express: `> npm install express`
  3. Scheduler: `> npm install node-schedule`
3. Starting the NodeJS Server (from within the js directory): `> node nodeServer.js`
  1. To stop the server, press CTRL+C
4. In /js/nodeClient.js, change `var socket = io.connect( 'http://sg.testing:8080' );` to the domain name you will be using in your environment. If you change the port, make sure to update `server.listen( 8080 );` in /js/nodeServer.js to match.
