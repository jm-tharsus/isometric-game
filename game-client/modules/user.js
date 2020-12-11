export class User {
	constructor(id, name, x, y) {
		this._id = id;
		this._name = name;
		this._pos = { x, y };
	}

	static create(id, name, x, y) {
		return new User(id, name, x, y);
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

	// XXX: Not sure if this should really live here..
	updateDisplay(ctx) {

	}
}