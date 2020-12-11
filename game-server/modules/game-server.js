
const WebSocketServer = require('ws').Server;

const { User } = require('./user');

class GameServer {
	constructor(port) {
		this._users = {};
		this._nextUserId = 1;
		this._port = port;
		this._mapInfo = { id: 1, width: 40, height: 40 };

		this._handleNewConnection = this._handleNewConnection.bind(this);
		this._createNewUser = this._createNewUser.bind(this);

		this._setupWebSocketServer();

		this._randomlyMovePlayers();
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
		this._notifyAllUsers(this._makeUserJoinMessage(user));

		ws.on('message', message => this._handleMessage(user, JSON.parse(message)));
	}

	_handleMessage(user, msg) {
		const { type, data } = msg;

		switch (type) {
		case 'USER_MOVE':
			return this.movePlayer(user.getId(), data.x, data.y);
		case 'USER_CHAT':
			return this.sendChatAsUser(user, data.text);
		}
	}

	_createNewUser(ws) {
		const userId = this._nextUserId++;
		this._users[userId] = new User(userId, ws);
		return this._users[userId];
	}

	_sendFullStateToUser(user) {
		// Tell the user about the map (just a dummy entry for now).
		const { id, width, height } = this._mapInfo;
		user.sendMessage('LOAD_MAP', { id, width, height, userId: user.getId() });

		// Tell the user about the other users.
		for (const otherUser of Object.values(this._users)) {
			const { type, data } = this._makeUserJoinMessage(otherUser);
			user.sendMessage(type, data);
		}
	}

	_notifyAllUsers(msg) {
		for (const user of Object.values(this._users)) {
			user.sendMessage(msg.type, msg.data);
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

	_makeUserMoveMessage(user) {
		const pos = user.getPos();
		return {
			type: 'USER_MOVE',
			data: {
				id: user.getId(),
				x: pos.x,
				y: pos.y
			}
		};
	}

	_makeUserChatMessage(user, text) {
		return {
			type: 'USER_CHAT',
			data: {
				id: user.getId(),
				text
			}
		};
	}

	getUserById(id) {
		return this._users[id] || null;
	}

	movePlayer(id, x, y) {
		x = Math.max(0, Math.min(x, this._mapInfo.width - 1));
		y = Math.max(0, Math.min(y, this._mapInfo.height - 1));
		const user = this.getUserById(id);
		user.setPos(x, y);
		this._notifyAllUsers(this._makeUserMoveMessage(user));
	}

	sendChatAsUser(user, text) {
		this._notifyAllUsers(this._makeUserChatMessage(user, text));
	}

	_randomlyMovePlayers() {
		setInterval(() => {
			for (const user of Object.values(this._users)) {
				const pos = user.getPos();
				let x = pos.x, y = pos.y;
				x += Math.random() > 0.5 ? 1 : -1;
				y += Math.random() > 0.5 ? 1 : -1;

				this.movePlayer(user.getId(), x, y);

				// Occasionally spam the chat.
				if (Math.random() > 0.9) {
					this._notifyAllUsers(this._makeUserChatMessage(user, 'Hello there!'));
				}
			}
		}, 1000);
	}
}

module.exports = { GameServer };