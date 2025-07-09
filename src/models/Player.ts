import { Property } from './Property'; // Importa propiedades que puede tener el jugador

// Representa a un jugador dentro del juego
export class Player {
  public name: string;                  // Nombre del jugador
  public amount: number;                // Dinero actual del jugador
  public tablePosition: number;         // Posición en el tablero
  public status: 'playing' | 'broke';   // Estado: jugando o en bancarrota
  public properties: Property[];        // Lista de propiedades del jugador

  constructor(name: string, initialAmount = 1500) {
    this.name = name;                   // Nombre asignado
    this.amount = initialAmount;        // Dinero inicial
    this.tablePosition = 0;             // Empieza en posición 0 (GO)
    this.status = 'playing';            // Estado inicial: jugando
    this.properties = [];               // Inicializa sin propiedades
  }

  // Agrega una propiedad al jugador
  addProperty(property: Property): void {
    this.properties.push(property);
  }

  // Elimina una propiedad del jugador
  removeProperty(property: Property): void {
    this.properties = this.properties.filter(p => p !== property);
  }
}
