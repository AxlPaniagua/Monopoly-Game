import {Player} from './player'
import { Property } from './property'

export class Game{
    public players: Player[] = [];
    public properties: Property[] = [];
    public currentTurn: number = 0;

    constructor(players: Player[], properties: Property[]) {
        this.players = players;
        this.properties = properties;
        this.currentTurn = 0;
        this.board = this.generateBoard();
    }

    public startGame(): void {
        console.log("🎲 Starting Monopoly Lite!");
        console.log("Players:", this.players.map(p => p.name).join(", "));
        console.log("---------------------------------------------");

        let gameEnded = false;
        let round = 1;
        const maxRounds = 30;

        while (!gameEnded && round <= maxRounds) {
            console.log(`\n🔄 Round ${round}`);
            const player = this.players[this.currentTurn];

            console.log(`👉 ${player.name}'s turn`);
            const dice = this.rollDice();
            console.log(`${player.name} rolled a 🎲 ${dice}`);

            this.movePlayer(dice);
            
            gameEnded = this.checkGameOver();

            if (!gameEnded) {
                this.nextTurn();
            }

            console.log("---------------------------------------------");
            round++;
        }

        if (!gameEnded) {
            console.log(`🛑 Max rounds (${maxRounds}) reached. Game ended due to time limit.`);
        } else {
            console.log("🏁 Game Over!");
        }
    }



    public rollDice(){
        return Math.floor(Math.random() * 6) + 1;
    }

    public movePlayer(steps: number): void{
        const player = this.players[this.currentTurn];//the actual player from currentTurn

        if(player.status === 'broke'){//validate if the player is broke and it is, the player going out of the game
            console.log(`${player.name} is broke and cannot move.`);
            return;
        }

        const previousPosition = player.tablePosition;//save the last position, and then sum th steps 
        player.tablePosition = (player.tablePosition + steps) % this.board.length;

        if(player.tablePosition < previousPosition){//if the new position is less than the previous one, it means the player completed a full lap around the board, pass "GO"
            player.amount += 200;
            console.log(`${player.name} passed GO and collected $200 💰`);
        }

        console.log(`${player.name} moved to tile ${player.tablePosition}`);
        this.handleLanding(player);
    }

    public handleLanding(player: Player): void {
        const tile = this.board[player.tablePosition];

        
        if (tile instanceof Property) {
            // If the property has no owner
            if (tile.owner === null) {
                // Check if the player can afford the property
                if (player.amount >= tile.cost) {
                    player.amount -= tile.cost;
                    tile.owner = player;
                    player.properties.push(tile);
                    console.log(`${player.name} bought ${tile.name} for $${tile.cost} 🏠`);
                } else {
                    console.log(`${player.name} cannot afford ${tile.name}. Price: $${tile.cost}, Available: $${player.amount}`);
                }
            }
            // If the property is owned by another player, pay rent
            else if (tile.owner !== player) {
                const rent = tile.cost * 0.1; // 10% of property cost as rent
                player.amount -= rent;
                tile.owner.amount += rent;

                console.log(`${player.name} landed on ${tile.name}, owned by ${tile.owner.name}, and paid $${rent.toFixed(2)} in rent.`);

                // Check if player went broke
                if (player.amount <= 0) {
                    player.status = 'broke';
                    console.log(`${player.name} went broke after paying rent 💸`);
                }
            }
            // If the property belongs to the player, do nothing
            else {
                console.log(`${player.name} landed on their own property: ${tile.name}`);
            }
        }
        // If the tile is not a Property (it's a string like "GO", "Jail", etc.)
        else if (typeof tile === 'string') {
            switch (tile) {
                case "GO":
                    console.log(`${player.name} landed exactly on GO. Take a breath and enjoy your salary 💵`);
                    break;
                case "Jail":
                    const jailFee = 300;
                    player.amount -= jailFee;
                    console.log(`${player.name} landed on Jail and paid a fine of $${jailFee} 👮`);

                    if (player.amount <= 0) {
                        player.status = 'broke';
                        console.log(`${player.name} went broke after paying the jail fine 💸`);
                    }
                    break;
                case "Surprise":
                    const surprise = Math.floor(Math.random() * 3) + 1;

                    if(surprise === 1){
                        console.log(`Sorry ${player.name} your surprise is a payment ($100)☠️`)
                    }else if(surprise === 2){
                        console.log(`Congratulations ${player.name} your surprise is a bonus ($100)🥳`)
                    }else if(surprise ===3){
                        console.log(`Congratulations ${player.name} your surprise is a payment ($300)🥳`)
                    }
                    
                    break;
                default:
                    console.log(`${player.name} landed on ${tile}`);
            }
        }
    }


    public nextTurn(): void {
        const totalPlayers = this.players.length;

        do {
            this.currentTurn = (this.currentTurn + 1) % totalPlayers;
        } while (this.players[this.currentTurn].status === 'broke');

        console.log(`🔁 It's now ${this.players[this.currentTurn].name}'s turn`);
    }

    public checkGameOver(): boolean{
        this.players.forEach(player=>{
            if(player.amount <= 0 && player.status !== 'broke'){
                player.status = 'broke';
                console.log(`${player.name} ha quebrado y está fuera del juego 💀`);
            }
        });

        const actives = this.players.filter(p => p.status === 'playing');

        if(actives.length ===1){
            console.log(`🎉 ${actives[0].name} gana el juego!`);
            return true; //end game
        }

        return false; //keep playing
    }

    public board: (Property | string)[] = []

    private generateBoard(): (Property | string)[]{

        return [
        "GO",
        new Property("Avenida Central", 200, "red"),

        "Surprise",
        new Property("Fuente de la Hispanidad", 180, "green"),

        "Jail",
        new Property("Estadio Carlos Ugalde", 220, "blue"),
        
    ];
    }
}