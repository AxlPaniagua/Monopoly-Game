import { Property } from './Property'; // Hereda de Property
import { Player } from './Player';     // Para saber cuántas estaciones tiene

// Representa una estación de tren que se puede comprar
export class Station extends Property {
  constructor(name: string, cost: number, rent?: number) {
    super(name, cost, "station", rent); // Siempre usa color "station"
  }

  // Calcula la renta multiplicada por la cantidad de estaciones del dueño
  calculateRent(owner?: Player): number {
    if (!owner) return this.rent;       // Si no hay dueño, renta base
    const ownedStations = owner.properties.filter(p => p instanceof Station).length;
    return this.rent * ownedStations;   // Renta base * estaciones poseídas
  }
}
