import {Coord} from "./types";

export class Vector{
    
    private coord: Coord;
    private occupied: boolean;
    private neighbours: {[key: string]: Vector | undefined};
    private occupiedFor: number | undefined;
    private distanceToOwnHead: number | undefined;

    /**
     * 
     * @param coord of vector as object symbolizing one field of the playboard.
     * @param occupied is true if the field isn't reachable for the snake.
     * @param occupiedFor the time in moves before the field will be free again.
     * 
     * @important in case of not editing the neighbours after initializing the vector every neighbour gets initialized as placeholder.
     */
    public constructor(coord: Coord, occupied: boolean, occupiedFor: number){
        this.coord = coord;
        this.occupied = occupied;
        this.occupiedFor = occupiedFor;

        const placeholder: Vector = new Vector({x: -1, y: -1}, false, 0);

        this.neighbours = {
            above: placeholder,
            below: placeholder,
            left: placeholder,
            right: placeholder
        }

        this.distanceToOwnHead = undefined;
    }

    public isOccupied(): boolean{
        return this.occupied;
    }
}