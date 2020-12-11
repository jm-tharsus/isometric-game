import { Viewport } from './viewport.js';
import { User } from './user.js';

export class GameClient {
	constructor(serverEndpointURI, parentEl) {
		this._serverEndpointURI = serverEndpointURI;
		this._parentEl = parentEl;
		this._createHTML();
		this._bindEvents();
		this._createViewport();
		this._connect();

		this._onWSOpen = this._onWSOpen.bind(this);
		this._onWSClose = this._onWSClose.bind(this);
		this._onWSMessage = this._onWSMessage.bind(this);
		this._onWSError = this._onWSError.bind(this);
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
		case 'USER_JOIN':
			return this._handleUserJoin(msg.data);
		case 'USER_LEAVE':
			return this._handleUserLeave(msg.data);
		case 'USER_MOVE':
			return this._handleUserMove(msg.data);
		default:
			console.log('Unknown message:', msg);
		}
	}

	_handleUserJoin(data) {
		const { id, name, x, y } = data;
		console.log(`User joined: ${name} (${id}) @ [${x}, ${y}]`);
		this._users[id] = User.create(id, name, x, y);
	}

	_handleUserLeave(data) {
		const { id, name, x, y } = data;
		console.log(`User left: ${name} (${id}) @ [${x}, ${y}]`);
		delete this._users[id];
	}
	
	_handleUserMove(data) {
		const { id, x, y } = data;
		const user = this._users[id];
		user.setPos(x, y);
		console.log(`User moved: ${user.getName()} (${id}) @ [${x}, ${y}]`);
		delete this._users[id];
	}

	_sendMessage(type, data) {
		this._ws.send(JSON.stringify({ type, data }));
	}
}