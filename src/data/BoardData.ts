import { SimpleTile } from '../models/Tile';
import { Street } from '../models/Street';
import { Station } from '../models/Station';
import { Property } from '../models/Property';

export const boardData = [
  new SimpleTile("GO"),
  new Street("Avenida Central", 200, "red", 20),
  new SimpleTile("Surprise"),
  new Street("Fuente de la Hispanidad", 180, "green", 18),
  new SimpleTile("Jail"),
  new Property("Estadio Carlos Ugalde", 220, "blue", 22),
  new Station("Estación del Norte", 150, 25),
  new SimpleTile("Community Chest"),
  new Street("Parque La Sabana", 250, "yellow", 25),
  new SimpleTile("Free Parking"),
  new Property("Puerto Limón", 170, "orange", 17),
  new SimpleTile("Go to Jail"),
  new Street("Volcán Poás", 300, "darkblue", 30),
  new Station("Estación del Sur", 150, 25),
  new SimpleTile("Income Tax"),
  new Street("Playa Tamarindo", 280, "purple", 28)
];
