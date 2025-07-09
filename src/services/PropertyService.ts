import { Player } from '../models/Player';   // Jugador
import { Property } from '../models/Property'; // Propiedad base
import { Street } from '../models/Street';     // Calles (opcional si necesitas lógica especial)
import { Station } from '../models/Station';   // Estaciones

import { playerService } from './PlayerService'; // Servicio para manejar dinero del jugador

// Servicio para manejar compra y renta de propiedades
export class PropertyService {
  private playerSvc = new playerService(); // Instancia del servicio de jugador

  // Gestiona lo que pasa cuando un jugador cae en una propiedad
  handlePropertyLanding(player: Player, property: Property) {
    if (!property.owner) {
      this.buyProperty(player, property); // Si está libre, la compra
    } else if (property.owner !== player) {
      this.payRent(player, property);     // Si tiene dueño, paga renta
    }
  }

  // Realiza la compra de la propiedad si tiene dinero suficiente
  private buyProperty(player: Player, property: Property) {
    if (player.amount >= property.cost) {
      this.playerSvc.deductMoney(player, property.cost, `compra ${property.name}`);
      property.owner = player;
      player.addProperty(property);
    }
  }

  // Cobra renta al jugador y paga al dueño
  private payRent(player: Player, property: Property) {
    const owner = property.owner;
    if (!owner) return;

    const rent = property.calculateRent(owner); // Calcula renta dinámica

    this.playerSvc.deductMoney(player, rent, `alquiler ${property.name}`);
    this.playerSvc.addMoney(owner, rent, `alquiler de ${player.name}`);
  }
}
