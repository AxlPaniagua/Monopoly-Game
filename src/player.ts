import { Property } from './property';


export class Player{
    public name: string = ''
    public amount: number = 0
    public tablePosition: number = 0
    public status: 'playing' | 'broke' = 'playing'
    public properties: Property[] = [];

    constructor(name: string, amount: number) {
        this.name = name;
        this.amount = amount;
        this.tablePosition = 0;
        this.status = 'playing';
        this.properties = [];
    }
}