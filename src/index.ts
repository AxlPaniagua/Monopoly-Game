// src/index.ts
import { createInterface } from 'readline/promises';
import { stdin as input, stdout as output } from 'process';

import { Player } from './models/Player';
import { Game, UI } from './core/Game';

const rl = createInterface({ input, output });

// UI de consola: confirmaciones y pasos
const ui: UI = {
  async confirm(msg: string) {
    while (true) {
      const raw = (await rl.question(`${msg} `)).trim().toLowerCase();
      const ans = raw.normalize('NFD').replace(/\p{Diacritic}/gu, ''); // maneja "sí"
      const c = ans[0];
      if (c === 's' || ans === 'si' || ans === 'yes' || c === 'y') return true;
      if (c === 'n' || ans === 'no') return false;
      console.log('Responde con "s" o "n", por favor 🙂');
    }
  },
  async step(msg = 'Presiona "s" para continuar...') {
    while (true) {
      const raw = (await rl.question(`${msg} `)).trim().toLowerCase();
      // Permite ENTER o "s"/"si"
      if (raw === '' || raw[0] === 's') return;
      console.log('Pulsa "s" (o ENTER) para seguir.');
    }
  }
};

async function startMatch() {
  const players = [
    new Player('Axel'),
    new Player('Catalina'),
    new Player('Nicole'),
  ];

  const game = new Game(players, ui);
  await game.startGame(); // Game.startGame es async
  await rl.question('\nPresiona ENTER para volver al menú...');
}

async function main() {
  let opt = '';
  do {
    console.clear();
    console.log('=== Menú Principal ===');
    console.log('1) Jugar');
    console.log('2) Salir');
    opt = (await rl.question('Elige una opción: ')).trim();

    if (opt === '1') {
      await startMatch();
    } else if (opt === '2') {
      console.log('¡Hasta luego!');
    } else {
      console.log('Opción inválida.');
      await rl.question('Presiona ENTER para continuar...');
    }
  } while (opt !== '2');

  rl.close();
}

main().catch(err => {
  console.error('Error:', err);
  rl.close();
});
