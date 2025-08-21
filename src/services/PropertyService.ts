// services/PropertyService.ts
import { Player } from '../models/Player';
import { Property } from '../models/Property';
import { Street } from '../models/Street';
import { Station } from '../models/Station';
import { playerService } from './PlayerService';

export class PropertyService {
  private playerSvc = new playerService();

  // Maneja la lógica de compra y alquiler de propiedades
  handlePropertyLanding(player: Player, property: Property) {
    if (!property.owner) {
      this.purchase(player, property);
    } else if (property.owner !== player) {
      this.payRent(player, property);
    }
  }

  // Permite al jugador comprar una propiedad si tiene suficiente dinero
  // y actualiza el estado de la propiedad
  // Si no tiene suficiente dinero, muestra un mensaje
  public purchase(player: Player, property: Property) {
    if (player.amount >= property.cost) {
      this.playerSvc.deductMoney(player, property.cost, `compra ${property.name}`);
      property.owner = player;
      player.addProperty(property);
    } else {
      console.log(`${player.name} no tiene dinero suficiente para comprar "${property.name}".`);
    }
  }

  // Permite al jugador pagar renta al dueño de la propiedad
  // Deduce el dinero del jugador y lo suma al dueño
  // Si la propiedad no tiene dueño, no hace nada
  // Si el jugador no tiene suficiente dinero, lo declara en quiebra
  // y actualiza su estado
  public payRent(player: Player, property: Property) {
    const owner = property.owner;
    if (!owner) return;

    const rent = property.calculateRent(owner);
    this.playerSvc.deductMoney(player, rent, `alquiler ${property.name}`);
    this.playerSvc.addMoney(owner, rent, `alquiler de ${player.name}`);
  }
}
