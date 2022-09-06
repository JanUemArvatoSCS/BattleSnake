import { Playfield } from "./Playfield";
import { column } from "./Interfaces";
import { Coord } from "./types";

export class TwoDimensionalArray {
    private width: number;
    private height: number;
    private twoDimArray: column[];

    /**
     * 
     * @param width enter the width of the matrix should be generated! (not index)
     * @param height enter the height of the matrix should be generated! (not index)
     */
    public constructor(width: number, height: number){
        this.width = width;
        this.height = height;
        this.twoDimArray = new Array();

        
        for(let indexForWidth = 0; indexForWidth < this.width; indexForWidth++){
            let rowsArray: Playfield[] = new Array();
            let oneColumn: column = {rows: rowsArray};
            for(let indexForHeight = 0; indexForHeight < this.height; indexForHeight++){
                let initField: Playfield = new Playfield(false);
                initField.setCoord(indexForWidth, indexForHeight);
                rowsArray.push(initField);
            }
            this.twoDimArray.push(oneColumn);
        }

    }

    /**
     * 
     * @returns width of the array. (not as index)
     */
    public getWidth(): number{
        return this.width;
    }

    /**
     * 
     * @returns height of the array. (not as index)
     */
    public getHeight(): number{
        return this.height;
    }

    /**
     * 
     * @param coord of the searched playfield.
     * @returns Playfield if the playfield is available. In any other case the return value is undefined.
     */
    public getPlayField(coord: Coord): Playfield | undefined{
        if(this.isInRangeOfArray(coord)){
            const returnField: Playfield = this.twoDimArray[coord.x].rows[coord.y];
            return returnField;
        }else{
            return undefined;
        }
        
    }

    /**
     * 
     * @param coord of the field to overwrite.
     * @param newPlayfield that is going to be at coord in the array.
     */
    public overwrite(coord: Coord, newPlayfield: Playfield): void{
        if(this.isInRangeOfArray(coord)){
            this.twoDimArray[coord.x].rows[coord.y] = newPlayfield;
        }else{
            console.log("-ERR 002: " + coord.x + "|" + coord.y + " are out of bounds!");
        }
    }

    /**
     * 
     * @param coord with the searched playfields around.
     * @returns if the coords are in bounds of the array the methode returns an array with the neighbours {Playfield for reachable neigbours and undefined for not reachable neighbours}. If the coord is out of bounds the methode returns undefined.
     */
    public getNeighbours(coord: Coord): {[key: string]: Playfield | undefined} | undefined{
        if(this.isInRangeOfArray(coord)){
            let neigbourAbove: Playfield | undefined = this.getPlayField({x: coord.x, y: coord.y + 1});
            let neigbourBelow: Playfield | undefined = this.getPlayField({x: coord.x, y: coord.y - 1});
            let neigbourLeft: Playfield | undefined = this.getPlayField({x: coord.x - 1, y: coord.y});
            let neigbourRight: Playfield | undefined = this.getPlayField({x: coord.x + 1, y: coord.y});

            let neigbours: {[key: string]: Playfield | undefined} = {
                above: neigbourAbove,
                below: neigbourBelow,
                left: neigbourLeft,
                right: neigbourRight
            }

            console.log("neighbours of " + coord.x + "|" + coord.y + ": ");
            console.log("above: " + neigbourAbove);
            console.log("below: " + neigbourBelow);
            console.log("left: " + neigbourLeft);
            console.log("right: " + neigbourRight);

            return neigbours;
        }else{
            console.log("-ERR 002: " + coord.x + "|" + coord.y + " are out of bounds!");
            return undefined;
        }
    }

    /**
     * 
     * @param coord that should be proved for being in bounds of the array.
     * @returns true if the coords are in bounds of array.
     */
    public isInRangeOfArray(coord: Coord): boolean{
        if(coord.x < this.width && coord.x >= 0 && coord.y < this.height && coord.y >= 0){
            return true;
        }else{
            return false;
        }
    }

    public occupieFieldsWithThreeOccupiedNeighbours(): void{
        for(let indexForW: number = 0; indexForW < this.width; indexForW++){
            for(let indexForH: number = 0; indexForH < this.height; indexForH++){
                let currentCoord: Coord = {x: indexForW, y: indexForH};
                let occupiedNeighbours: number = 0;
                let neighbours = this.getNeighbours(currentCoord);
                if(neighbours){
                    if(!(neighbours.above) || neighbours.above.isOccupied()){
                        occupiedNeighbours++;
                    }
                    if(!(neighbours.below) || neighbours.below.isOccupied()){
                        occupiedNeighbours++;
                    }
                    if(!(neighbours.left) || neighbours.left.isOccupied()){
                        occupiedNeighbours++;
                    }
                    if(!(neighbours.right) || neighbours.right.isOccupied()){
                        occupiedNeighbours++;
                    }
                    if(occupiedNeighbours >= 3){
                        this.twoDimArray[indexForW].rows[indexForH].setOccupied(true);
                        console.log("found field with three neighbours: " + indexForW + " | " + indexForH)
                    }
                }
            }
        }
    }

    public setForAllFieldsVisited(visited: boolean) : void{
        for(let indexForW: number = 0; indexForW < this.width; indexForW++){
            for(let indexForH: number = 0; indexForH < this.height; indexForH++){
                this.twoDimArray[indexForW].rows[indexForH].visited = visited;
            }
        }
    }

    private playfieldIsInArray(playfield: Playfield, fieldArray: Playfield[]): boolean{
        let found: boolean = false;
        for(let index = 0; index < fieldArray.length; index++){
            if(playfield.getCoord()?.x === fieldArray[index].getCoord()?.x && playfield.getCoord()?.y === fieldArray[index].getCoord()?.y){
                found = true;
            }
        }
        return found;
    }

    private getPlayFieldForceType(coord: Coord): Playfield{
        return this.twoDimArray[coord.x].rows[coord.y];
    }

    
}