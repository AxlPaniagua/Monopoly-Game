import { Player } from '../models/Player'; // Jugador
import { Tile } from '../models/Tile';     // Casillas del tablero

// Servicio para manejar acciones de dinero y movimiento del jugador
export class playerService {
  private readonly GO_AMOUNT = 200; // Monto por pasar GO

  // Mueve al jugador por el tablero y paga GO si pasa por la salida
  movePlayer(player: Player, steps: number, board: Tile[]) {
    const prev = player.tablePosition;
    player.tablePosition = (player.tablePosition + steps) % board.length;
    if (player.tablePosition < prev) {
      this.addMoney(player, this.GO_AMOUNT, 'pasar GO');
    }
  }

  // Suma dinero al jugador con razón
  addMoney(player: Player, amount: number, reason: string) {
    player.amount += amount;
    console.log(`${player.name} recibe $${amount} por ${reason}.`);
  }

  // Resta dinero al jugador con razón y verifica bancarrota
  deductMoney(player: Player, amount: number, reason: string) {
    player.amount -= amount;
    console.log(`${player.name} paga $${amount} por ${reason}.`);
    return this.checkBrokeStatus(player);
  }

  // Verifica si el jugador quedó en bancarrota
  checkBrokeStatus(player: Player) {
    if (player.amount <= 0 && player.status !== 'broke') {
      player.status = 'broke';
      player.properties.forEach(p => p.owner = null);
      player.properties = [];
      console.log(`${player.name} está en bancarrota.`);
      return true;
    }
    return player.status === 'broke';
  }

  // Genera una carta sorpresa: resta o suma dinero al azar
  handleSurpriseCard(player: Player) {
    const surprise = Math.floor(Math.random() * 3) + 1;
    if (surprise === 1) this.deductMoney(player, 100, 'Sorpresa');
    else if (surprise === 2) this.addMoney(player, 100, 'Sorpresa');
    else this.addMoney(player, 300, 'Sorpresa');
  }
}
