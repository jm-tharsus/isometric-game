class User {
	constructor(id, ws) {
		this._id = id;
		this._ws = ws;
		this._pos = { x: 0, y: 0 }; // TODO: Needs to be set properly.
		this._name = 'User #' + id;
	}

	getId() {
		return this._id;
	}

	getName() {
		return this._name;
	}

	getPos() {
		return Object.assign({}, this._pos);
	}

	setPos(x, y) {
		this._pos.x = x;
		this._pos.y = y;
	}

	sendMessage(type, data) {
		this._ws.send(JSON.stringify({ type, data }));
	}
}

module.exports = { User };