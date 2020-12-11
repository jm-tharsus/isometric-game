
const WebSocketServer = require('ws').Server;

const { User } = require('./user');

class GameServer {
	constructor(port) {
		this._connections = [];
		this._users = {};
		this._nextUserId = 1;
		this._port = port;

		this._handleNewConnection = this._handleNewConnection.bind(this);
		this._createNewUser = this._createNewUser.bind(this);

		this._setupWebSocketServer();
	}

	static create(port) {
		return new GameServer(port);
	}

	_setupWebSocketServer() {
		this._webSocketServer = new WebSocketServer({ port: this._port });

		// Handle new connections.
		this._webSocketServer.on('connection', this._handleNewConnection);
	}

	_handleNewConnection(ws) {
		const user = this._createNewUser(ws);
	
		user.sendMessage('Welcome: ' + user.getName());

		ws.on('message', function incoming(message) {
			console.log('received: %s', message);
			ws.send('something:' + message);
		});
	}

	_createNewUser(ws) {
		const userId = this._nextUserId++;
		this._users[userId] = new User(userId, ws);
		return this._users[userId];
	}
}

module.exports = { GameServer };