import { Player } from './Player'; // Jugador que puede ser dueño
import { Tile } from './Tile';     // Hereda de casilla genérica

// Clase base para propiedades comprables del tablero
export class Property extends Tile {
  public cost: number;             // Costo de compra de la propiedad
  public color: string;            // Color o grupo de la propiedad
  public owner: Player | null;     // Jugador dueño (o null si está libre)
  public rent: number;             // Monto de renta base

  constructor(name: string, cost: number, color: string, rent?: number) {
    super(name);                   // Inicializa nombre desde Tile
    this.cost = cost;              // Asigna costo de compra
    this.color = color;            // Asigna color o grupo
    this.owner = null;             // Inicialmente sin dueño
    this.rent = rent ?? cost * 0.1; // Calcula renta si no se pasa explícita
  }

  // Calcula la renta a pagar; se puede sobreescribir en subclases
  calculateRent(owner?: Player): number {
    return this.rent;
  }
}
