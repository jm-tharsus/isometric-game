import { Viewport } from './viewport.js';
import { User } from './user.js';

export class GameClient {
	constructor(serverEndpointURI, parentEl) {
		this._serverEndpointURI = serverEndpointURI;
		this._parentEl = parentEl;

		this._users = {};
		this._thisUser = null;
		this._mapInfo = { id: 0, width: 1, height: 1 };
		this._coordCache = {};
		this._regenerateCoordCache();

		this._createHTML();
		this._bindEvents();
		this._createViewport();

		this._onWSOpen = this._onWSOpen.bind(this);
		this._onWSClose = this._onWSClose.bind(this);
		this._onWSMessage = this._onWSMessage.bind(this);
		this._onWSError = this._onWSError.bind(this);

		this._connect();
	}

	static create(serverEndpointURI, parentEl) {
		return new GameClient(serverEndpointURI, parentEl);
	}

	_connect() {
		this._ws = new WebSocket(this._serverEndpointURI);
		this._ws.addEventListener('open', this._onWSOpen);
		this._ws.addEventListener('close', this._onWSClose);
		this._ws.addEventListener('message', this._onWSMessage);
		this._ws.addEventListener('error', this._onWSError);
	}

	_createHTML() {
		this._containerEl = document.createElement('div');
		this._containerEl.className = 'isometric-game-container';
		this._parentEl.appendChild(this._containerEl);
	}

	_createViewport() {
		this._viewport = new Viewport(this, 600, 300);
	}

	_bindEvents() {
		// Set up key bindings for movement, changing name, chat.
	}

	_onWSOpen(evt) {
		console.log('Web Socket connection opened:', evt);
	}

	_onWSClose(evt) {
		console.log('Web Socket connection closed:', evt);
	}

	_onWSMessage(evt) {
		// Assume message payload is JSON string and attempt to parse, process.
		this._handleMessage(JSON.parse(evt.data));
	}

	_onWSError(evt) {
		console.warn('Web Socket error:', evt);
	}

	_handleMessage(msg) {
		switch (msg.type) {
		case 'LOAD_MAP':
			return this._handleLoadMap(msg.data);
		case 'USER_JOIN':
			return this._handleUserJoin(msg.data);
		case 'USER_LEAVE':
			return this._handleUserLeave(msg.data);
		case 'USER_MOVE':
			return this._handleUserMove(msg.data);
		case 'USER_CHAT':
			return this._handleUserChat(msg.data);
		default:
			console.log('Unknown message:', msg);
		}
	}

	_handleLoadMap(data) {
		const { id, width, height } = data;
		console.log(`Loading map: ${id} :: [${width}x${height}]`);

		// XXX: Ideally this would be done with a map loader class, etc.
		this._mapInfo.id = id;
		this._mapInfo.width = width;
		this._mapInfo.height = height;

		this._regenerateCoordCache();
	}

	_handleUserJoin(data) {
		const { id, name, x, y } = data;
		console.log(`User joined: ${name} (${id}) @ [${x}, ${y}]`);
		this._users[id] = User.create(id, name, x, y);

		// Consider the first user we're told about to be "us"...?
		if (this._thisUser) {
			this._thisUser = this._users[id];
		}

		this._regenerateCoordCache();
	}

	_handleUserLeave(data) {
		const { id, name, x, y } = data;
		console.log(`User left: ${name} (${id}) @ [${x}, ${y}]`);
		delete this._users[id];

		this._regenerateCoordCache();
	}

	_handleUserMove(data) {
		const { id, x, y } = data;
		const user = this._users[id];
		if (!user) {
			console.warn('User move for unknown user: ' + id);
			return;
		}
		user.setPos(x, y);
		console.log(`User moved: ${user.getName()} (${id}) @ [${x}, ${y}]`);

		this._regenerateCoordCache();
	}

	_handleUserChat(data) {
		const { id, text } = data;
		const user = this._users[id];
		if (!user) {
			console.warn('User chat for unknown user: ' + id);
			return;
		}
		console.log(`User chat: ${name} (${id}) :: ${text}]`);
		user.setChatBubble(text);
	}

	_sendMessage(type, data) {
		this._ws.send(JSON.stringify({ type, data }));
	}

	_regenerateCoordCache() {
		this._coordCache = {};

		for (let x = 0; x < this._mapInfo.width; x++) {
			this._coordCache[x] = {};

			for (let y = 0; y < this._mapInfo.height; y++) {
				this._coordCache[x][y] = {
					users: Object.values(this._users).filter(user => {
						const pos = user.getPos();
						return pos.x === x && pos.y === y;
					})
				};
			}
		}
	}
}