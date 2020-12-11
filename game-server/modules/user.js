class User {
	constructor(id, ws) {
		this._id = id;
		this._ws = ws;
		this._name = 'Random Name ' + Math.floor(Date.now() / 10000);
	}

	getName() {
		return this._name;
	}

	sendMessage(msg) {
		this._ws.send(msg);
	}
}

module.exports = { User };