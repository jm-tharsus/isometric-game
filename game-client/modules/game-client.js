import { Viewport } from './viewport.js';

export class GameClient {
	constructor(serverEndpointURI, parentEl) {
		this._serverEndpointURI = serverEndpointURI;
		this._parentEl = parentEl;
		this._createHTML();
		this._bindEvents();
		this._createViewport();
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
}



/////////////



// var wsUri = "ws://localhost:8080/";
// var output;

// function init() {
// 	output = document.getElementById("output");
// 	testWebSocket();
// }

// function testWebSocket() {
// 	websocket = new WebSocket(wsUri);
// 	websocket.onopen = function (evt) { onOpen(evt) };
// 	websocket.onclose = function (evt) { onClose(evt) };
// 	websocket.onmessage = function (evt) { onMessage(evt) };
// 	websocket.onerror = function (evt) { onError(evt) };
// }

// function onOpen(evt) {
// 	writeToScreen("CONNECTED");
// 	doSend("WebSocket rocks");
// }

// function onClose(evt) {
// 	writeToScreen("DISCONNECTED");
// }

// function onMessage(evt) {
// 	writeToScreen('<span style="color: blue;">RESPONSE: ' + evt.data + '</span>');
// 	// websocket.close();
// }

// function onError(evt) {
// 	writeToScreen('<span style="color: red;">ERROR:</span> ' + evt.data);
// }

// function doSend(message) {
// 	writeToScreen("SENT: " + message);
// 	websocket.send(message);
// }

// function writeToScreen(message) {
// 	var pre = document.createElement("p");
// 	pre.style.wordWrap = "break-word";
// 	pre.innerHTML = message;
// 	output.appendChild(pre);
// }

// window.addEventListener("load", init, false);