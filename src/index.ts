import { Player } from './models/Player'; // Jugador
import { Game } from './core/Game';        // Núcleo del juego

// Lista de jugadores que participan en la partida
const players = [
  new Player("Axel"),
  new Player("Catalina"),
  new Player("Nicole"),
];

// Crea instancia del juego y lo inicia
const game = new Game(players);
game.startGame();
