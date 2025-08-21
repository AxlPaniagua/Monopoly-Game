import { Property } from './Property'; // Hereda de Property

// Representa una calle que puede tener casas para aumentar la renta
export class Street extends Property {
  public houses: number; // Número de casas construidas en la calle

  constructor(name: string, cost: number, color: string, rent?: number) {
    super(name, cost, color, rent); // Inicializa propiedades base
    this.houses = 0;                // Empieza sin casas construidas
  }
}
