// Servicio para manejar la lógica de tirar dados
export class diceService {
  // Devuelve un número aleatorio entre 1 y 6
  rollDice(): number {
    return Math.floor(Math.random() * 6) + 1;
  }
}
