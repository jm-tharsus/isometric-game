import { GameClient } from './game-client.js';

export function initialise(uri, parentEl) {
	return GameClient.create(uri, parentEl);
}
