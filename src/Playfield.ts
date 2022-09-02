import { Coord } from "../src/types";

export class Playfield{

    private occupied: boolean;
    public occupiedFor: number | undefined;
    public distanceToOwnHead: number | undefined;
    private coord: Coord | undefined;
    private neighbours: {[key: string]: Playfield | undefined};
    private visited: boolean;

    public constructor(occupied: boolean){
        this.occupied = occupied;
        this.occupiedFor = undefined;
        this.distanceToOwnHead = undefined;
        this.visited = false;

        this.neighbours = {
            above: undefined,
            below: undefined,
            left: undefined,
            right: undefined
        }
    }

    /**
     * 
     * @returns true if the field is occupied.
     */
    public isOccupied(): boolean{
        return this.occupied;
    }

    /**
     * 
     * @returns the time the field will be occupied. If the obstacle isn't moving or the field isn't occupied the return value will be undefined.
     */
    public isOccupiedFor(): number | undefined{
        if(this.occupiedFor){
            return this.occupiedFor;
        }else{
            return undefined;
        }
    }

    /**
     * 
     * @returns the distance between the playfield and the head of the own battlesnake. If the distance isn't defined the return value will be undefined.
     */
    public getDistanceToOwnHead(): number | undefined{
        if(this.distanceToOwnHead){
            return this.distanceToOwnHead;
        }else{
            return undefined;
        }
    }

    public getCoord(): Coord | undefined{
        if(this.coord){
            return this.coord;
        }else{
            return undefined;
        }
    }

    /**
     * 
     * @returns an array with the neighbours of the playfield. The neighbours are normaly initialized as undefined and just can be used in case of route calculation.
     */
    public getNeighbours(): {[key: string]: Playfield | undefined} {
        return this.neighbours;
    }

    /**
     * 
     * @param occupied enter true if there is some obstacle on the field!
     */
    public setOccupied(occupied: boolean): void{
        this.occupied = occupied;
    }

    /**
     * 
     * @param occupiedFor enter the time the field will be occupied as number. If the time is unknown or the field isn't occupied enter undefined.
     */
    public setOccupiedFor(occupiedFor: number | undefined): void{
        this.occupiedFor = occupiedFor;
    }

    /**
     * 
     * @param distanceToOwnHead enter the distance to the head of the own battlesnake. If the distance is unknown or not necessary enter undefined.
     */
    public setDistanceToOwnHead(distanceToOwnHead: number | undefined): void{
        this.distanceToOwnHead = distanceToOwnHead;
    }

    public setCoord(x: number, y: number): void{
        this.coord = {x: x, y: y};
    }

    /**
     * 
     * @param key enter which neigbour should be replaced. In case of the neigbour above enter "above". Other cases are "below" | "left" | "right".
     * @param neighbour enter the playfield that should be inserted. In case of a playfield out of bounds enter undefined.
     */
    public setNeighbour(key: string, neighbour: Playfield | undefined): void{
        if(key === "above"){
            this.neighbours.above = neighbour;
        }else if(key === "below"){
            this.neighbours.below = neighbour;
        }else if(key === "left"){
            this.neighbours.left = neighbour;
        }else if(key === "right"){
            this.neighbours.right = neighbour;
        }else{
            console.log("-ERR 001: " + "'" + key + "'" + "isn't an existing neighbour!");
        }
    }

    /**
     * 
     * @returns true if the field was already visited.
     */
    public alreadyVisited(): boolean{
        return this.visited;
    } 

    public setVisited(visited: boolean): void{
        this. visited = visited;
    }

}