import {Coord} from "./types"

export class Vector{
    private coordOfVektor: Coord;
    private occupied: boolean;
    private neighbours: Vector[];
    private occupiedFor: number;
    private distanceToOwnHead: number;

    /**
     * 
     * @param coordOfVektor coords of current vector.
     * @param occupied if the vector is occupied enter true. In any other case enter false.
     * @param occupiedFor if some moving object is on the field enter the time the object will stay.
     * @param distanceTwoOwnHead distance between current vector and the head of the own snake.
     * 
     * @initializingNeighboursOfCurrentVector while initializing a vector the neighbours are unknown. The neighbour-vectors will be initialized with parameter: coord{x: -11, y: -11}, occupied: false, occupiedFor: 0, distanceToOwnHead: 0.
     */
    public constructor(coordOfVektor: Coord, occupied: boolean, occupiedFor: number, distanceToOwnHead: number){
        this.coordOfVektor = coordOfVektor;
        this.occupied = occupied;
        this.occupiedFor = occupiedFor;
        this.distanceToOwnHead = distanceToOwnHead;
        this.neighbours = new Array();
        const placeHolder: Vector = new Vector({x: -11, y: -11}, false, 0, 0);
        let counter: number = 4;
        while(counter > 0){
            this.neighbours.push(placeHolder);
            counter--;
        }
    }

    public getNeighbours(): {[key: string]: Vector | undefined} | undefined{
        if(this.neighbours.length === 4){
            let directNeighbours: {[key: string]: Vector} = {
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

    public getCoord(): Coord{
        return this.coordOfVektor;
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
    
    public setCoord(newCoord: Coord){
        this.coordOfVektor = newCoord;
    }

    public setOccupied(occupied: boolean){
        this.occupied = occupied;
    }

    public setOccupiedFor(occupiedFor: number){
        this.occupiedFor = occupiedFor;
    }

    public setDistanceToOwnHead(distanceToOwnHead: number){
        this.distanceToOwnHead = distanceToOwnHead;
    }

    public addNeighbourAbove(neighbour: Vector): void{
        this.neighbours[0] = neighbour;
    }

    public addNeighbourBelow(neighbour: Vector): void{
        this.neighbours[1] = neighbour;
    }

    public addNeighbourLeft(neighbour: Vector): void{
        this.neighbours[2] = neighbour;
    }

    public addNeighbourRight(neighbour: Vector): void{
        this.neighbours[3] = neighbour;
    }
}