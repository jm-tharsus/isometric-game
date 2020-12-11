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
		this._ctx.fillStyle = 'green';
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
				// Draw the tile.
				this._ctx.strokeStyle = 'yellow';
				this._ctx.strokeRect(
					x * TILE_WIDTH, y * TILE_HEIGHT,
					TILE_WIDTH, TILE_HEIGHT);

				// Draw the users.
				coordCache[x][y].users.forEach(u => this._drawUser(u));
			}
		}
	}

	// XXX: Not sure if this should really live here..
	_drawUser(user) {
		// Draw sprite
		// Draw chat bubble
		const { x, y } = user.getPos();

		this._ctx.fillStyle = 'cyan';
		this._ctx.fillRect(
			x * TILE_WIDTH, y * TILE_HEIGHT - TILE_HEIGHT,
			TILE_WIDTH, TILE_HEIGHT * 2);
	}
}