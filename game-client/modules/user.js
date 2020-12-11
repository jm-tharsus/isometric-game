const CHAT_BUBBLE_DURATION = 3000;
export class User {
	constructor(id, name, x, y) {
		this._id = id;
		this._name = name;
		this._pos = { x, y };
		this._chatBubbleText = '';
		this._chatBubbleTime = -1;
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

	setChatBubble(text) {
		this._chatBubbleText = text;
		this._chatBubbleTime = Date.now();
	}

	getChatBubbleText() {
		if (this._chatBubbleTime > Date.now() - CHAT_BUBBLE_DURATION) {
			return this._chatBubbleText;
		} else {
			return null;
		}
	}
}