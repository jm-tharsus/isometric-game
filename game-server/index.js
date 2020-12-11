const PORT = 8081;

console.log('Starting game server...');

const { GameServer } = require('./modules/game-server');

GameServer.create(PORT);
