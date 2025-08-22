🎩 🎲 💰 Monopoly Game (TypeScript CLI) 🎩 🎲 💰

🚀 A small Monopoly style game for the command line, built with TypeScript/Node.js.  
👥 It lets you manage players, run turn-by-turn games, and persist the players list to a JSON file.

---

🚀 Features 🚀
- Console-based gameplay with a minimal UI (`confirm` and `step` prompts).
- Automatic turn order handled by `TurnManager`.
- Dice rolls, player movement, and tile actions.
- Properties with purchase and **rent** payment.
- Special tiles: GO, Jail, and Surprise (simplified random events).
- Game ends when only one active player remains or after 30 rounds.
- Winner by cash (ties handled).
- Player persistence in `src/data/players.json`.

---

🧭 Main Menu 🧭
1) Play –> starts a match using the current players.
2) Manage players –> add/remove/save/load.
3) Save players –> writes src/data/players.json.
4) Load players –> reads src/data/players.json.
0) Exit.

---

🎮 How to Play 🎮
- Use the menu to manage players (you need at least 2).
- You can add, remove, save, and load players.
- Names are stored in src/data/players.json.
- Choose “Play” and follow the on-screen instructions.
- During a turn:
  - The game shows the dice, tile, and actions.
  - If you land on an unowned property, the game asks if you want to buy it (y/n).
  - If you land on someone else’s property, you pay rent automatically.
  - For automatic steps, press s or ENTER when prompted.
  - At the end, a summary shows cash and properties, and the winner by cash is declared.

---

🧩 Rules 🧩
- GO: collect $200 when you pass or land on it.
- Jail: pay a $50 fine when you land on it.
- Surprise: random events defined in PlayerService.
- Properties: buy if unowned; pay rent if owned by someone else.
- Round limit: 30; if reached, the player with most cash wins (ties possible).
- Game over: when only one player remains with status "playing".

---

✅ Requirements ✅
- **Node.js 18+** (check with `node -v`)
- **npm** (check with `npm -v`)

---

▶️ Quick Start ▶️

bash
1) Clone the repo
    - cd Monopoly-Game

2) Install dependencies
    - npm install

3) Run directly with ts-node (no scripts)
    - npx ts-node src/index.ts
