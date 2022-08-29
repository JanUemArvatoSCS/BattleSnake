import {Coord} from "./types"

export class Vektor{
    private coordOfVektor: Coord;
    private occupied: boolean;
    private neighbours: Vektor[];
    private occupiedFor: number;
    private distanceToOwnHead: number;

    public constructor(coordOfVektor: Coord, occupied: boolean, occupiedFor: number, distanceTwoOwnHead: number){
        this.coordOfVektor = coordOfVektor;
        this.occupied = occupied;
        this.occupiedFor = 0;
        this.distanceToOwnHead = 0;
        this.neighbours = new Array();
        const placeHolder: Vektor = new Vektor({x: -11, y: -11}, false, 0, 0);
        let counter: number = 4;
        while(counter > 0){
            this.neighbours.push(placeHolder);
            counter--;
        }
    }

    public getNeighbours(): {[key: string]: Vektor} | undefined{
        if(this.neighbours.length === 4){
            let directNeighbours: {[key: string]: Vektor} = {
                up: this.neighbours[0],
                down: this.neighbours[1],
                left: this.neighbours[2],
                right: this.neighbours[3]
            }
            return directNeighbours;
        }else{
            return undefined;
        }
    }

    public isOccupied(): boolean{
        return this.occupied;
    }

    public isOccupiedFor(): number{
        return this.occupiedFor;
    }

    public getDistanceToOwnHead(): number{
        return this.distanceToOwnHead;
    }

    public addNeighbourAbove(neighbour: Vektor): void{
        this.neighbours[0] = neighbour;
    }

    public addNeighbourBelow(neighbour: Vektor): void{
        this.neighbours[1] = neighbour;
    }

    public addNeighbourLeft(neighbour: Vektor): void{
        this.neighbours[2] = neighbour;
    }

    public addNeighbourRight(neighbour: Vektor): void{
        this.neighbours[3] = neighbour;
    }
}

export interface columns{
    rows: Vektor[];
}

