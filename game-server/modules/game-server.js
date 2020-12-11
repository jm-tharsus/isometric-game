
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
	
		// Notify new user about existing users.
		this._sendFullStateToUser(user);

		// Notify existing users of this one.
		const joinMsg = this._makeUserJoinMessage(user);
		for (const otherUser of Object.values(this._users)) {
			otherUser.sendMessage(joinMsg.type, joinMsg.data);
		}

		ws.on('message', function incoming(message) {
			console.log('received: %s', message);
			// ws.send('something:' + message);
		});

		// [ ] Notify everyone when a new user joins
		// [ ] Notify everyone when they leave
		// [ ] Notify when they move
	}

	_createNewUser(ws) {
		const userId = this._nextUserId++;
		this._users[userId] = new User(userId, ws);
		return this._users[userId];
	}

	_sendFullStateToUser(user) {
		// Tell the user about the map (just a dummy entry for now.)
		user.sendMessage('LOAD_MAP', {
			id: 1,
			width: 40,
			height: 40
		});

		for (const otherUser of Object.values(this._users)) {
			const { type, data } = this._makeUserJoinMessage(otherUser);
			user.sendMessage(type, data);
		}
	}

	_makeUserJoinMessage(user) {
		const pos = user.getPos();
		return {
			type: 'USER_JOIN',
			data: {
				id: user.getId(),
				name: user.getName(),
				x: pos.x,
				y: pos.y
			}
		};
	}
}

module.exports = { GameServer };