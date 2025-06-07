import { Property } from './property';


export class Player{
    public name: string;
    public amount: number = 1500
    public tablePosition: number = 0
    public status: 'playing' | 'broke' = 'playing'
    public properties: Property[] = [];

    constructor(name: string) {
        this.name = name;
        this.tablePosition = 0;
        this.status = 'playing';
        this.properties = [];
    }
}