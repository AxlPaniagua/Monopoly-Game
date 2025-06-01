import {Player} from './player'
import { Property } from './property'

export class Game{
    public players: Player[] = [];
    public properties: Property[] = [];
    public currentTurn: number = 0;
    //public board: (Property | null)[] = [];

    constructor(players: Player[], properties: Property[]) {
        this.players = players;
        this.properties = properties;
        this.currentTurn = 0;
        //this.board = this.generateBoard();
    }

    public startGame(){

    }

    public rollDice(){

    }

    public movePlayer(){

    }

    public handleLanding(){

    }

    public nextTurn(){

    }

    public checkGameOver(){
        
    }
}