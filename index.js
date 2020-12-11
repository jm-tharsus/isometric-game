const WebSocketServer = require('ws').Server;
const server = new WebSocketServer({ port: 8080 });

server.on('connection', function connection(ws) {
	ws.on('message', function incoming(message) {
		console.log('received: %s', message);
		ws.send('something:' + message);
	});
	ws.send('something');
});