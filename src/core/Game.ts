// src/core/Game.ts
import { Player } from '../models/Player';
import { Tile } from '../models/Tile';
import { Property } from '../models/Property';
import { boardData } from '../data/BoardData';
import { TurnManager } from './TurnManager';
import { diceService } from '../services/DiceService';
import { playerService } from '../services/PlayerService';
import { PropertyService } from '../services/PropertyService';

// UI mínima para confirmaciones/pausas (inyectable)
export type UI = {
  // Pregunta sí/no (por ejemplo, para comprar)
  confirm(msg: string): Promise<boolean>;
  // Pausa paso-a-paso para acciones automáticas
  step(msg?: string): Promise<void>;
};

// Clase principal que gestiona la partida de Monopoly
export class Game {
  private players: Player[];              // Jugadores en la partida
  private board: Tile[];                  // Casillas del tablero
  private turnManager: TurnManager;       // Controla el turno de cada jugador
  private diceSvc = new diceService();    // Servicio para tirar dados
  private playerSvc = new playerService();// Servicio para manejar acciones del jugador
  private propertySvc = new PropertyService(); // Servicio para manejar propiedades
  private ui?: UI;                        // Interfaz de usuario (opcional)

  constructor(players: Player[], ui?: UI) {
    this.players = players;
    this.board = boardData;               // Inicializa el tablero con los datos
    this.turnManager = new TurnManager(players); // Inicializa el turno de juego
    this.ui = ui;
  }

  // Inicia y ejecuta toda la partida (modo interactivo)
  async startGame() {
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

      if (tile instanceof Property) {
        // ——— Compra interactiva si no tiene dueño ———
        if (!tile.owner) {
          let buy = true; // por defecto compra (compatibilidad)
          if (this.ui) {
            buy = await this.ui.confirm(
              `${player.name}, "${tile.name}" cuesta $${tile.cost} (renta $${tile.rent}). ¿Quieres comprarla? (s/n)`
            );
          }
          if (buy) {
            this.propertySvc.purchase(player, tile);
          } else {
            console.log(`${player.name} decidió NO comprar "${tile.name}".`);
          }
          // No hacemos step aquí (ya interactuaste con confirm)
        } else if (tile.owner !== player) {
          // ——— Pago automático de renta ———
          console.log('🏷️ La propiedad ya tiene dueño. Pagarás renta.');
          this.propertySvc.payRent(player, tile);
          await this.ui?.step('Presiona "s" para continuar...');
        } else {
          // Propiedad propia
          console.log('🏠 Propiedad propia. No pagas renta.');
          await this.ui?.step('Presiona "s" para continuar...');
        }
      } else if (tile.name === 'Surprise') {               // Sorpresa
        this.playerSvc.handleSurpriseCard(player);
        await this.ui?.step('Presiona "s" para continuar...');
      } else if (tile.name === 'GO') {                     // Si cae en GO
        console.log(`🚩 ${player.name} pasó GO y recibe $200`);
        this.playerSvc.addMoney(player, 200, 'pasar GO');
        await this.ui?.step('Presiona "s" para continuar...');
      } else if (tile.name === 'Jail') {                   // Si cae en Jail
        console.log(`🚔 ${player.name} cayó en la cárcel y paga $50 de multa.`);
        this.playerSvc.deductMoney(player, 50, 'pago de multa Jail');
        await this.ui?.step('Presiona "s" para continuar...');
      } else {
        // Casillas simples (Free Parking, Community Chest, Income Tax, Go to Jail, etc.)
        await this.ui?.step('Presiona "s" para continuar...');
      }

      console.log(`💰 Dinero después del turno: $${player.amount}`);

      over = this.isGameOver();                            // Verificar fin de juego
      this.turnManager.nextTurn();                         // Siguiente turno
      round++;
    }

    this.printSummary();                                   // Mostrar resumen final
  }

  // Fin si solo queda un jugador activo (el resumen decide ganador por dinero)
  isGameOver(): boolean {
    const actives = this.players.filter(p => p.status === 'playing');
    return actives.length <= 1;
  }

  // Muestra el resumen final y declara ganador por dinero (maneja empates)
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

    // Ganador(es) por dinero
    const maxMoney = Math.max(...this.players.map(p => p.amount));
    const winners = this.players.filter(p => p.amount === maxMoney);

    if (winners.length === 1) {
      console.log(`\n🎉🎉 GANADOR por dinero: ${winners[0].name} con $${winners[0].amount} 🎉🎉`);
    } else {
      console.log(`\n🤝 Empate por dinero entre: ${winners.map(w => w.name).join(', ')} con $${maxMoney}`);
    }

    console.log('\n🏆 ¡Gracias por jugar Monopoly! 🏆');
  }
}
