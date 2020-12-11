const TILE_WIDTH = 40;
const TILE_HEIGHT = 20;

export class Viewport {
	constructor(gameClient, width, height) {
		this._viewportSize = { width, height };
		
		// Store a reference to the game client.
		this._gameClient = gameClient;

		// Create the viewport-specific HTML.
		this._createHTML();

		// Trigger an initial draw.
		this._updateDisplay = this._updateDisplay.bind(this);
		window.requestAnimationFrame(this._updateDisplay);
	}

	_createHTML() {
		// Create the main viewport container element.
		this._containerEl = document.createElement('div');
		this._containerEl.className = 'viewport-container';

		// Create a canvas to draw onto.
		this._canvasEl = document.createElement('canvas');
		this._canvasEl.width = this._viewportSize.width;
		this._canvasEl.height = this._viewportSize.height;
		this._containerEl.appendChild(this._canvasEl);
		this._ctx = this._canvasEl.getContext('2d');

		this._gameClient._containerEl.appendChild(this._containerEl);
	}

	_updateDisplay() {
		// Clear the canvas.
		this._ctx.fillStyle = 'black';
		this._ctx.fillRect(0, 0, this._canvasEl.width, this._canvasEl.height);

		this._drawMap();

		// Schedule another frame of animation.
		window.requestAnimationFrame(this._updateDisplay);
	}

	_drawMap() {
		// [ ] Draw the tile at 0, 0
		// [ ] Draw the users at that tile.
		// [ ] ... draw next tile, etc.

		// Need to be able to identify users by their coordinates, for rapid
		// painting, but only have them keyed by their respective ids atm...

		const mapInfo = this._gameClient._mapInfo;
		const coordCache = this._gameClient._coordCache;

		for (let x = 0; x < mapInfo.width; x++) {
			for (let y = 0; y < mapInfo.height; y++) {
				// const coords = this._toScreenCoords(x, y);

				// Draw the tile.
				// this._ctx.strokeStyle = 'yellow';
				// this._ctx.strokeRect(
				// 	coords.x, coords.y,
				// 	TILE_WIDTH, TILE_HEIGHT);
				
				this._drawTile(1, Math.random() > 0.8 ? this._rand(5, 13) : 4, x, y);

				// Draw the users.
				coordCache[x][y].users.forEach(u => this._drawUser(u));
			}
		}

		for (let x = 0; x < mapInfo.width; x++) {
			for (let y = 0; y < mapInfo.height; y++) {
				coordCache[x][y].users.forEach(u => this._drawUserChatBubble(u));
			}
		}
	}

	_rand(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min) + min);
	}

	_toScreenCoords(x, y) {
		const origin = {
			x: this._canvasEl.width / 2,
			y: this._canvasEl.height / 2
		};

		return {
			x: (origin.x) + (x - y) * (TILE_WIDTH / 2),
			y: (origin.y) + (x + y) * (TILE_HEIGHT / 2),
		};
	}

	_drawTile(tilesetId, tileIndex, x, y) {
		const tileset = this._gameClient._tilesets[tilesetId];
		const image = tileset.getImage();
		const rect = tileset.getTileRect(tileIndex);

		const coords = this._toScreenCoords(x, y);

		this._ctx.drawImage(image,
			rect.x, rect.y,
			rect.w, rect.h,
			
			coords.x, coords.y,
			rect.w, rect.h);
	}

	// XXX: Not sure if this should really live here..
	_drawUser(user) {
		// Draw sprite
		// Draw chat bubble
		const { x, y } = user.getPos();

		const coords = this._toScreenCoords(x, y);

		this._ctx.fillStyle = 'rgba(0,0,0,0.5)';
		this._ctx.fillRect(
			coords.x + 10, coords.y - TILE_HEIGHT,
			TILE_WIDTH - 20, TILE_HEIGHT * 2);
	}

	_drawUserChatBubble(user) {
		const { x, y } = user.getPos();

		const coords = this._toScreenCoords(x, y);

		const chatBubbleText = user.getChatBubbleText();
		if (chatBubbleText !== null) {
			const maxCols = 12, len = chatBubbleText.length,
				totalLines = Math.floor(len / maxCols),
				lineHeight = 14, padding = 5;

			const bubbleW = padding * 2 + TILE_WIDTH + 100;
			const bubbleH = padding * 2 + totalLines * lineHeight + lineHeight;
			const bubbleX = coords.x - 50;
			const bubbleY = coords.y - TILE_HEIGHT * 2 - bubbleH;

			// Draw chat box.
			this._ctx.fillStyle = 'rgba(255,255,255,0.5)';
			this._ctx.fillRect(bubbleX, bubbleY, bubbleW, bubbleH);

			// Draw chat text.
			this._ctx.font = '16px monospace';
			this._ctx.fillStyle = 'black';

			let curRow = 0, i = 0;
			while (i < len) {
				let numChars = Math.min(maxCols, len);
				let frag = chatBubbleText.substr(i, numChars);
				this._ctx.fillText(frag, bubbleX + padding, bubbleY + padding + lineHeight + (curRow * lineHeight));
				curRow++;
				i += numChars;
			}
		}
	}
}