import { Vector } from "./Vector";
import {column} from "./typesFor2dArr";
import {Coord} from "./types";
import { threadId } from "worker_threads";

export class TwoDimensionalArray{
    private storage: column[];
    private width: number;
    private height: number;

    public constructor(width: number, height: number){
        this.width = width;
        this.height = height;
        this.storage = new Array();
        for(let indexForWidth = 0; indexForWidth < this.width; indexForWidth++){
            let rowsForOneColumn: Vector[] = new Array();
            for(let indexForHeight = 0; indexForHeight < this.height; indexForHeight++){
                let currentCoord: Coord = {x: indexForWidth, y: indexForHeight};
                let vektorToAdd: Vector = new Vector(currentCoord, false, 0, 0);
                rowsForOneColumn.push(vektorToAdd);
            }
            let oneCollum: column = {rows: rowsForOneColumn};
            this.storage.push(oneCollum);
        }
    }

    

    /**
     * 
     * @param startigCoord the coords of the grids starting point.
     * 
     * This methode is used to generate a grid using the neighbour function of it's vectors.
     * It will be important for route calculation.
     */
    public generateGridFromCoord(startigCoord: Coord): void{
        console.log("starting generation of Grid from: " + startigCoord.x + "|" + startigCoord.y + " ...");
        console.log("checking if coords are in bounds of playfield...");
        if(this.isInRangeOfArray(startigCoord)){
            console.log("confirmed!");
            console.log("refreshing data of playfields...");
            //if the entered param is available:
            for(let indexForWidth = 0; indexForWidth < this.width; indexForWidth++){
                console.log("starting iteration " + (indexForWidth + 1));
                for(let indexForHeight = 0; indexForHeight < this.height; indexForHeight++){
                    let coordsInArray: Coord = {x: indexForWidth, y: indexForHeight};
                    if(this.isVectorOnCorrectPlace(coordsInArray, this.storage[indexForWidth].rows[indexForHeight])){
                        //if coords saved in vector and the vector's place in array are equal:
                        let vectorWithRefreshedInfos: Vector = this.storage[indexForWidth].rows[indexForHeight];
                        let distanceBetweenStartingCoordsAndVector: number | undefined = this.calculateDistanceBetweenCoords(vectorWithRefreshedInfos.getCoord(), startigCoord);
                        if(distanceBetweenStartingCoordsAndVector === undefined){
                            console.log("-ERR wasn't able to calculate distance between: " + vectorWithRefreshedInfos.getCoord().x + "|" + vectorWithRefreshedInfos.getCoord().y + " --> " + startigCoord.x + "|" + startigCoord.y);
                        }else{
                            //if calculation was sucessfull:
                            vectorWithRefreshedInfos.setDistanceToOwnHead(distanceBetweenStartingCoordsAndVector);
                            this.replaceVector(coordsInArray, vectorWithRefreshedInfos);
                        }
                    }else{
                        console.log("-ERR playfield " + indexForWidth + "|" + indexForHeight + " has invalid data");
                    }
                }
            }
            console.log("finished refreshing!")
            let vektorList: Vector[] = new Array();
            let snakeGrid: Vector = this.refreshNeighbourGridRek(startigCoord, vektorList);
            this.replaceVector(startigCoord, snakeGrid);
            console.log("finished grid generation!");
        }else{
            console.log("coords are not in bounds of playfield. canceling generation process...");
        }
    }

    public getVector(coordOfSearchedVector: Coord): Vector | undefined{
        if(this.isInRangeOfArray(coordOfSearchedVector)){
           return this.storage[coordOfSearchedVector.x].rows[coordOfSearchedVector.y];
        }else{
            return undefined;
        }
    }

    public calculateDistanceBetweenCoords(pos1: Coord, pos2: Coord): number | undefined{
        if(this.isInRangeOfArray(pos1) && this.isInRangeOfArray(pos2)){
            let distance: number = Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
            return distance;
        }else{
            return undefined;
        }
    }

    private refreshNeighbourGridRek(startingPos: Coord, listOfVisitedVector: Vector[]): Vector {
        let returnVector: Vector = this.getVectorForceVector(startingPos);
        listOfVisitedVector.push(returnVector);
        let neighbours = this.getNeighboursInArray(startingPos.x, startingPos.y);
        
        let goUp: boolean = true;
        let goDown: boolean = true;
        let goLeft: boolean = true;
        let goRight: boolean = true;
        for(let index = 0; index < listOfVisitedVector.length; index++){
            if(JSON.stringify(listOfVisitedVector[index]) === JSON.stringify(neighbours.up)){
                goUp = false;
            }else if(JSON.stringify(listOfVisitedVector[index]) === JSON.stringify(neighbours.down)){
                goDown = false;
            }else if(JSON.stringify(listOfVisitedVector[index]) === JSON.stringify(neighbours.left)){
                goLeft = false;
            }else if(JSON.stringify(listOfVisitedVector[index]) === JSON.stringify(neighbours.right)){
                goRight = false;
            }
        }
        if(neighbours.up === undefined){
            goUp = false;
        }
        if(neighbours.down === undefined){
            goDown = false;
        }
        if(neighbours.left === undefined){
            goLeft = false;
        }
        if(neighbours.right === undefined){
            goRight = false;
        }

        if(goUp){
            returnVector.addNeighbourAbove(this.refreshNeighbourGridRek({x: startingPos.x, y: startingPos.y + 1}, listOfVisitedVector));
        }
        if(goDown){
            returnVector.addNeighbourBelow(this.refreshNeighbourGridRek({x: startingPos.x, y: startingPos.y - 1}, listOfVisitedVector));
        }
        if(goLeft){
            returnVector.addNeighbourLeft(this.refreshNeighbourGridRek({x: startingPos.x - 1, y: startingPos.y}, listOfVisitedVector));
        }
        if(goRight){
            returnVector.addNeighbourRight(this.refreshNeighbourGridRek({x: startingPos.x + 1, y: startingPos.y}, listOfVisitedVector))
        }

        return returnVector;
    }

    private getVectorForceVector(coord: Coord): Vector{
        return this.storage[coord.x].rows[coord.y];
    }

    private replaceVector(coord: Coord, newVector: Vector): void{
        if(this.isInRangeOfArray(coord)){
            this.storage[coord.x].rows[coord.y] = newVector
        }else{
            console.log("-ERR while replacing playfield data at " + coord.x + "|" + coord.y);
        }
    }

    private isInRangeOfArray(coord: Coord): boolean{
        if(coord.x < this.width && coord.x >= 0 && coord.y < this.height && coord.y >= 0){
            return true;
        }else{
            return false;
        }
    }

    private getNeighboursInArray(x: number, y: number): {[key: string]: Vector | undefined}{
        if(x >= 0 && x < this.width && y >= 0 && y < this.height){
            //if x and y are in range of array:
            let neighbourAbove: Vector | undefined;
            let neighborBelow: Vector | undefined;
            let neighbourLeft: Vector | undefined;
            let neighbourRight: Vector | undefined;

            if(y < this.height - 1){
                //if y doesn't hit upper border:
                neighbourAbove = this.storage[x].rows[y + 1];
            }else{
                //if there isn't a neighbor above:
                neighbourAbove = undefined;
            }if(y > 0){
                //if y doesn't hit lower border:
                neighborBelow = this.storage[x].rows[y - 1];
            }
            else{
                //if there isn't a neighbour below:
                neighborBelow = undefined;
            }
            if(x < this.width - 1){
                //if x doesn't hit the right border:
                neighbourRight = this.storage[x + 1].rows[y];
            }else{
                //if there isn't a right neighbour:
                neighbourRight = undefined;
            }
            if(x > 0){
                //x doesn't hit the left border:
                neighbourLeft = this.storage[x - 1].rows[y];
            }else{
                //if there isn't a left neighbour:
                neighbourLeft = undefined;
            }
            //initialize returnArray with neighbours
            let returnArray: {[key: string]: Vector | undefined} = {
                up: neighbourAbove,
                down: neighborBelow,
                left: neighbourLeft,
                right: neighbourRight
            }

            return returnArray;
        }else{
            console.log("-ERR calculating neighbours from " + x + "|" + y + " wasn't sucessfull")
            let emptyArray: {[key: string]: Vector | undefined} = {};
            return emptyArray;
        }
        
    }

    private isVectorOnCorrectPlace(coord: Coord, vector: Vector): boolean{
        if(JSON.stringify(coord) === JSON.stringify(vector.getCoord)){
            return true;
        }else{
            return false;
        }
    }
}