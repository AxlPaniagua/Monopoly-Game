// index.ts
import { Player } from './player';
import { Game } from './game';

// Create players
const players: Player[] = [
    new Player("Axel"),
    new Player("Catalina"),
    new Player("Nicole")
];

// Initialize game 
const game = new Game(players, []);

// Start the game loop
game.startGame();
