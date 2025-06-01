import { Player } from './player';

export class Property {
    public name: string = '';
    public cost: number = 0;
    public color: string = '';
    public owner: Player | null = null;
    public status: 'available' | 'owned' = 'available';

    constructor(name: string, cost: number, color: string) {
        this.name = name;
        this.cost = cost;
        this.color = color;
        this.owner = null;
        this.status = 'available';
    }
}
