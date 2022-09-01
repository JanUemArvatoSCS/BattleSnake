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
            let neigbourLeft: Playfield | undefined = this.getPlayField({x: coord.x, y: coord.y - 1});
            let neigbourRight: Playfield | undefined = this.getPlayField({x: coord.x, y: coord.y + 1});

            let neigbours: {[key: string]: Playfield | undefined} = {
                above: neigbourAbove,
                below: neigbourBelow,
                left: neigbourLeft,
                right: neigbourRight
            }

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

    public generateGrid(coord: Coord): Playfield | undefined{
        if(this.isInRangeOfArray(coord)){
            console.log(coord.x + "|" + coord.y + " are in bounds of array starting grid generation:")
            let playfieldsReachable: Playfield[] = new Array();
            let playfieldWithGrid: Playfield = this.gridGeneratorRek(coord, playfieldsReachable);
            return playfieldWithGrid;
        }else{
            console.log("-ERR 002: " + coord.x + "|" + coord.y + " are out of bounds!");
            return undefined;
        }
    }

    /**
     * 
     * @param currentCoord of playfield the methode is adding to grid by getting it's neighbours.
     * @param playfieldsVisited an array of playfield being already part of the grid.
     * @returns a playfield with a grid of reachable fields saved in his neighbours.
     */
    private gridGeneratorRek(currentCoord: Coord, playfieldsVisited: Playfield[]): Playfield{
        let visitAbove: boolean = true;
        let visitBelow: boolean = true;
        let visitLeft: boolean = true;
        let visitRight: boolean = true;

        console.log("Iteration: " + (playfieldsVisited.length + 1))

        let currentPlayfield: Playfield = this.getPlayFieldForceType(currentCoord);
        currentPlayfield.setDistanceToOwnHead(playfieldsVisited.length);
        let neighbours: {[key: string]: Playfield | undefined} | undefined = this.getNeighbours(currentCoord);
        playfieldsVisited.push(currentPlayfield);

        if(!(this.isInRangeOfArray({x: currentCoord.x, y: currentCoord.y + 1}))){
            visitAbove = false;
        }
        if(!(this.isInRangeOfArray({x: currentCoord.x, y: currentCoord.y - 1}))){
            visitBelow = false;
        }
        if(!(this.isInRangeOfArray({x: currentCoord.x - 1, y: currentCoord.y}))){
            visitLeft = false;
        }
        if(!(this.isInRangeOfArray({x: currentCoord.x + 1, y: currentCoord.y}))){
            visitRight = false;
        }

        if(neighbours){
            for(let index = 0; index < playfieldsVisited.length; index++){
                if(neighbours.above && JSON.stringify(neighbours.above) === JSON.stringify(playfieldsVisited[index])){
                    visitAbove = false;
                    console.log(currentCoord.x + "|" + (currentCoord.y + 1) + " already has been added. No more neighbour above.");
                }
                if(neighbours.below && JSON.stringify(neighbours.below) === JSON.stringify(playfieldsVisited[index])){
                    visitBelow = false;
                    console.log(currentCoord.x + "|" + (currentCoord.y - 1) + " already has been added. No more neighbour below.");
                }
                if(neighbours.right && JSON.stringify(neighbours.right) === JSON.stringify(playfieldsVisited[index])){
                    visitRight = false;
                    console.log((currentCoord.x + 1) + "|" + currentCoord.y + " already has been added. No more neighbour right.");
                }
                if(neighbours.left && JSON.stringify(neighbours.left) === JSON.stringify(playfieldsVisited[index])){
                    visitLeft = false;
                    console.log((currentCoord.x - 1) + "|" + currentCoord.y + " already has been added. No more neighbour left.");
                }
            }

            if(neighbours.above && !(neighbours.above.isOccupied()) && visitAbove){
                currentPlayfield.setNeighbour("above", this.gridGeneratorRek({x: currentCoord.x, y: currentCoord.y + 1}, playfieldsVisited));
            }
            if(neighbours.below && !(neighbours.below.isOccupied()) && visitBelow){
                currentPlayfield.setNeighbour("below", this.gridGeneratorRek({x: currentCoord.x, y: currentCoord.y - 1}, playfieldsVisited));
            }
            if(neighbours.left && !(neighbours.left.isOccupied()) && visitLeft){
                currentPlayfield.setNeighbour("left", this.gridGeneratorRek({x: currentCoord.x - 1, y: currentCoord.y}, playfieldsVisited));
            }
            if(neighbours.right && !(neighbours.right.isOccupied()) && visitRight){
                currentPlayfield.setNeighbour("right", this.gridGeneratorRek({x: currentCoord.x + 1, y: currentCoord.y}, playfieldsVisited));
            }

        }
        return currentPlayfield;
    }

    private getPlayFieldForceType(coord: Coord): Playfield{
        return this.twoDimArray[coord.x].rows[coord.y];
    }
}