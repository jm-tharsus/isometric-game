export class Sprite {
	constructor(id, width, height, tileWidth, tileHeight, imageUrl) {
		this._id = id;
		this._width = width;
		this._height = height;
		this._tileWidth = tileWidth;
		this._tileHeight = tileHeight;
		this._imageUrl = imageUrl;
		this._image = new Image();
		this._image.src = imageUrl;
	}

	getImage() {
		return this._image;
	}

	getTileRect(tileOffset) {
		const y = Math.floor(tileOffset / this._width);
		const x = tileOffset - y * this._width;

		return {
			x: x * this._tileWidth,
			y: y * this._tileHeight,
			w: this._tileWidth,
			h: this._tileHeight
		};
	}
}