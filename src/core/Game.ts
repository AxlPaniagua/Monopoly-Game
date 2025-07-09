import { Player } from '../models/Player';
import { Tile } from '../models/Tile';
import { Property } from '../models/Property';
import { boardData } from '../data/BoardData';
import { TurnManager } from './TurnManager';
import { diceService } from '../services/DiceService';
import { playerService } from '../services/PlayerService';
import { PropertyService } from '../services/PropertyService';

// Clase principal que gestiona la partida de Monopoly
export class Game {
  private players: Player[];              // Jugadores en la partida
  private board: Tile[];                  // Casillas del tablero
  private turnManager: TurnManager;       // Controla el turno de cada jugador
  private diceSvc = new diceService();    // Servicio para tirar dados
  private playerSvc = new playerService();// Servicio para manejar acciones del jugador
  private propertySvc = new PropertyService(); // Servicio para manejar propiedades

  constructor(players: Player[]) {
    this.players = players;
    this.board = boardData;               // Inicializa el tablero con los datos
    this.turnManager = new TurnManager(players); // Inicializa el turno de juego
  }

  // Inicia y ejecuta toda la partida
  startGame() {
    let over = false;
    let round = 1;

    console.log('\n🎲🎲 BIENVENIDO A MONOPOLY 🎲🎲\n');

    while (!over && round <= 30) {
      const player = this.turnManager.getCurrentPlayer();

      if (player.status === 'broke') {    // Si el jugador está quebrado, pasa turno
        this.turnManager.nextTurn();
        continue;
      }

      console.log(`\n==================== TURNO ${round} ====================`);
      console.log(`🎲 Turno de: ${player.name}`);
      console.log(`💵 Dinero disponible: $${player.amount}`);

      const dice = this.diceSvc.rollDice();  // Tirar dados
      console.log(`🎲 Dados: ${dice}`);
      
      this.playerSvc.movePlayer(player, dice, this.board); // Mover jugador

      const tile = this.board[player.tablePosition];       // Casilla donde cayó
      console.log(`📍 ${player.name} cayó en: ${tile.name}`);

      if (tile instanceof Property) {                      // Si es propiedad
        this.propertySvc.handlePropertyLanding(player, tile);
      } else if (tile.name === 'Surprise') {               // Si es sorpresa
        this.playerSvc.handleSurpriseCard(player);
      } else if (tile.name === 'GO') {                     // Si pasa GO
        console.log(`🚩 ${player.name} pasó GO y recibe $200`);
        this.playerSvc.addMoney(player, 200, 'pasar GO');
      } else if (tile.name === 'Jail') {                   // Si cae en Jail
        console.log(`🚔 ${player.name} cayó en la cárcel y paga $50 de multa.`);
        this.playerSvc.deductMoney(player, 50, 'pago de multa Jail');
      }

      console.log(`💰 Dinero después del turno: $${player.amount}`);

      over = this.isGameOver();                            // Verificar fin de juego
      this.turnManager.nextTurn();                         // Siguiente turno
      round++;
    }

    this.printSummary();                                   // Mostrar resumen final
  }

  // Verifica si solo queda un jugador activo
  isGameOver(): boolean {
    const actives = this.players.filter(p => p.status === 'playing');
    if (actives.length <= 1) {
      console.log(`\n🎉🎉 GANADOR: ${actives[0].name} 🎉🎉`);
      return true;
    }
    return false;
  }

  // Muestra el resumen final con dinero y propiedades
  printSummary() {
    console.log('\n==================== RESUMEN FINAL ====================\n');

    this.players.forEach(player => {
      console.log(`👤 ${player.name}`);
      console.log(`   💵 Dinero: $${player.amount}`);
      if (player.properties.length > 0) {
        console.log(`   🏠 Propiedades:`);
        player.properties.forEach(p => {
          console.log(`     - ${p.name} ($${p.cost})`);
        });
      } else {
        console.log(`   🏚️ Sin propiedades`);
      }
    });

    console.log('\n🏆 ¡Gracias por jugar Monopoly! 🏆');
  }
}
