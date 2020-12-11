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
	}
}