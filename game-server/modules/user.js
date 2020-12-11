class User {
	constructor(id, ws) {
		this._id = id;
		this._ws = ws;
		this._name = 'Random Name ' + Math.floor(Date.now() / 10000);
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
		// TODO: This needs a nice transition/walking animation. Perhaps setPosAnim().
		this._pos.x = x;
		this._pos.y = y;
	}

	sendMessage(type, data) {
		this._ws.send(JSON.stringify({ type, data }));
	}
}

module.exports = { User };