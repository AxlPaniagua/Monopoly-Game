import { Player } from '../models/Player';

// Administra el orden de los turnos de los jugadores
export class TurnManager {
  private players: Player[];  // Lista de jugadores
  private index = 0;          // Índice del jugador actual

  constructor(players: Player[]) {
    this.players = players;   // Inicializa la lista de jugadores
  }

  // Devuelve el jugador que tiene el turno actual
  getCurrentPlayer() {
    return this.players[this.index];
  }

  // Avanza al siguiente jugador activo (omite jugadores quebrados)
  nextTurn() {
    do {
      this.index = (this.index + 1) % this.players.length;
    } while (this.players[this.index].status === 'broke');
  }
}
