// services/PropertyService.ts
import { Player } from '../models/Player';
import { Property } from '../models/Property';
import { Street } from '../models/Street';
import { Station } from '../models/Station';
import { playerService } from './PlayerService';

export class PropertyService {
  private playerSvc = new playerService();

  // Mantén por compatibilidad si lo usas en otros lados
  handlePropertyLanding(player: Player, property: Property) {
    if (!property.owner) {
      this.purchase(player, property);
    } else if (property.owner !== player) {
      this.payRent(player, property);
    }
  }

  // ——— AHORA PÚBLICO ———
  public purchase(player: Player, property: Property) {
    if (player.amount >= property.cost) {
      this.playerSvc.deductMoney(player, property.cost, `compra ${property.name}`);
      property.owner = player;
      player.addProperty(property);
    } else {
      console.log(`${player.name} no tiene dinero suficiente para comprar "${property.name}".`);
    }
  }

  // ——— AHORA PÚBLICO ———
  public payRent(player: Player, property: Property) {
    const owner = property.owner;
    if (!owner) return;

    const rent = property.calculateRent(owner);
    this.playerSvc.deductMoney(player, rent, `alquiler ${property.name}`);
    this.playerSvc.addMoney(owner, rent, `alquiler de ${player.name}`);
  }
}
