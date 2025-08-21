// Casilla base del tablero, puede ser cualquier tipo de tile
export class Tile {
  public name: string; // Nombre de la casilla

  constructor(name: string) {
    this.name = name;  // Asigna nombre de la casilla
  }
}

// Casilla simple: no se puede comprar, solo ejecuta acción
export class SimpleTile extends Tile {
  constructor(name: string) {
    super(name); // Inicializa nombre usando Tile
  }
}
