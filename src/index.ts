import { createInterface } from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import { promises as fs } from 'fs';
import path from 'path';

import { Player } from './models/Player';
import { Game, UI } from './core/Game';

const rl = createInterface({ input, output });
const DATA_FILE = path.resolve(process.cwd(), 'src', 'data', 'players.json');
let players: Player[] = [];

// === Colores ANSI (sin libs) ===
const c = {
  bold: (s: string) => `\x1b[1m${s}\x1b[0m`,
  cyan: (s: string) => `\x1b[36m${s}\x1b[0m`,
  gray: (s: string) => `\x1b[90m${s}\x1b[0m`,
  green: (s: string) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s: string) => `\x1b[33m${s}\x1b[0m`,
  red: (s: string) => `\x1b[31m${s}\x1b[0m`,
};

// Caja simple (estilo boxen-lite)
function box(text: string) {
  const lines = text.split('\n');
  const width = Math.max(...lines.map(l => l.length));
  const top = `┌${'─'.repeat(width + 2)}┐`;
  const mid = lines.map(l => `│ ${l.padEnd(width)} │`).join('\n');
  const bot = `└${'─'.repeat(width + 2)}┘`;
  return `${top}\n${mid}\n${bot}`;
}
function header(title: string, subtitle?: string) {
  console.clear();
  const content = subtitle
    ? `${c.bold(c.cyan(title))}\n${c.gray(subtitle)}`
    : c.bold(c.cyan(title));
  console.log(box(content));
}
const info    = (m:string)=>console.log(box(m));
const success = (m:string)=>console.log(box(c.green(m)));
const warn    = (m:string)=>console.log(box(c.yellow(m)));
const error   = (m:string)=>console.log(box(c.red(m)));

function listPlayers() {
  if (!players.length) { console.log(c.gray('— No hay jugadores —')); return; }
  players.forEach((p, i) => console.log(`${c.cyan(String(i+1).padStart(2,' '))}. ${p.name}`));
}
const pause = (msg='Presiona ENTER para continuar...') => rl.question(c.gray(`\n${msg}`));

// === Persistencia ===
async function savePlayers() {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(players.map(p => ({ name: p.name })), null, 2), 'utf-8');
  success(`Guardado en ${path.relative(process.cwd(), DATA_FILE)}`);
}
async function loadPlayers() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    const arr: {name:string}[] = JSON.parse(raw);
    const unique = Array.from(new Set(arr.map(a => (a.name||'').trim()).filter(Boolean)));
    players = unique.map(n => new Player(n));
    success(`Cargados ${players.length} jugador(es).`);
  } catch (e: any) {
    if (e?.code === 'ENOENT') warn('Aún no existe archivo de jugadores.');
    else { error('Error al cargar jugadores.'); console.error(e); }
  }
}

// === UI para Game ===
const ui: UI = {
  async confirm(msg: string) {
    for (;;) {
      const raw = (await rl.question(`${msg} `)).trim().toLowerCase();
      const ans = raw.normalize('NFD').replace(/\p{Diacritic}/gu, '');
      if (['s','si','y','yes'].includes(ans) || ans[0]==='s' || ans[0]==='y') return true;
      if (['n','no'].includes(ans) || ans[0]==='n') return false;
      console.log(c.yellow('Responde "s" o "n".'));
    }
  },
  async step(msg = 'Presiona "s" (o ENTER) para continuar...') {
    for (;;) {
      const raw = (await rl.question(`${msg} `)).trim().toLowerCase();
      if (raw === '' || raw[0] === 's') return;
      console.log(c.yellow('Pulsa "s" o ENTER.'));
    }
  }
};

// === Flujos de gestión ===
async function addPlayers() {
  header('Gestionar jugadores', 'Agregar');
  listPlayers();
  const raw = (await rl.question('\nNombres separados por coma (ENTER cancela): ')).trim();
  if (!raw) { warn('Cancelado.'); return; }
  const exist = new Set(players.map(p => p.name.toLowerCase()));
  const toAdd = [...new Set(raw.split(',').map(s => s.trim()).filter(Boolean))]
    .filter(n => !exist.has(n.toLowerCase()));
  players.push(...toAdd.map(n => new Player(n)));
  success(`Agregados: ${toAdd.join(', ') || '—'}`);
}
async function removePlayers() {
  header('Gestionar jugadores', 'Eliminar');
  if (!players.length) { warn('No hay jugadores.'); return; }
  listPlayers();
  const ans = (await rl.question('\nNúmero o nombre a eliminar (ENTER cancela): ')).trim();
  if (!ans) { warn('Cancelado.'); return; }
  const n = Number(ans);
  const idx = !Number.isNaN(n) ? n-1 : players.findIndex(p => p.name.toLowerCase() === ans.toLowerCase());
  if (idx >= 0 && idx < players.length) success(`Eliminado: ${players.splice(idx,1)[0].name}`);
  else warn('No se encontró ese jugador.');
}
async function managePlayers() {
  for (;;) {
    header('Gestionar jugadores', 'Agrega, elimina, guarda o carga');
    listPlayers();
    console.log(`\n${c.cyan('1)')} Agregar  ${c.cyan('2)')} Eliminar  ${c.cyan('3)')} Cargar  ${c.cyan('4)')} Guardar  ${c.cyan('0)')} Volver`);
    const opt = (await rl.question('\nElige: ')).trim();
    if (opt==='1') { await addPlayers(); await pause(); }
    else if (opt==='2') { await removePlayers(); await pause(); }
    else if (opt==='3') { await loadPlayers(); await pause(); }
    else if (opt==='4') { await savePlayers(); await pause(); }
    else if (opt==='0') break;
  }
}

// === Juego ===
async function startMatch() {
  if (players.length < 2) {
    warn('Necesitas mínimo 2 jugadores.');
    await pause('ENTER para gestionar jugadores...');
    await managePlayers();
    if (players.length < 2) return;
  }
  header('¡A jugar!');
  info(`Participan: ${c.bold(players.map(p => p.name).join(', '))}`);
  console.log();
  await ui.step('ENTER para comenzar...');
  await new Game(players, ui).startGame();
  await rl.question('\nENTER para volver al menú...');
}

// === Menú principal ===
async function main() {
  await loadPlayers().catch(()=>{});
  for (;;) {
    header('=== Menú Principal ===', 'Usa números para elegir');
    if (players.length) { console.log(c.gray('Jugadores:')); listPlayers(); console.log(); }
    else { warn('Aún no has agregado jugadores.'); console.log(); }
    console.log(`${c.cyan('1)')} Jugar\n${c.cyan('2)')} Gestionar jugadores\n${c.cyan('3)')} Guardar jugadores\n${c.cyan('4)')} Cargar jugadores\n${c.cyan('0)')} Salir`);
    const opt = (await rl.question('\nElige: ')).trim();
    if (opt==='1') await startMatch();
    else if (opt==='2') await managePlayers();
    else if (opt==='3') { await savePlayers(); await pause(); }
    else if (opt==='4') { await loadPlayers(); await pause(); }
    else if (opt==='0') { console.log(c.green('¡Hasta luego! 👋')); break; }
  }
  rl.close();
}
main().catch(e => { console.error(c.red('Error:'), e); rl.close(); });
