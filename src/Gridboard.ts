import { TwoDimensionalArray } from "./TwoDimensionalArray";
import { GameState, Battlesnake, Coord, Board } from "./types";
import { Playfield } from "./Playfield";
import { priorityMove } from "./Interfaces";

export class Gridboard {

    private gameState: GameState;
    private food: Coord[];
    private battlesnakes: Battlesnake[];
    private hazards: Coord[];
    private behaviour: string;
    public playboard: TwoDimensionalArray;

    public constructor(gameState: GameState){
        this.gameState = gameState;
        this.food = gameState.board.food;
        this.battlesnakes = gameState.board.snakes;
        this.hazards = gameState.board.hazards;
        this.playboard = new TwoDimensionalArray(this.gameState.board.width, this.gameState.board.height);
        this.behaviour = this.calculateBehaviour();

        this.upgradePlayboardInformation();
    }

    public calculateNextMove(): string{
        let input: {[key: string] : priorityMove};

        input = this.nextStepForLoop();
        let answere: string = "";
        let highestPriority: number = 0;

        if(input.moveUp.available){
            highestPriority = input.moveUp.priority;
            answere = "up";
        }
        if(input.moveDown.available){
            if(highestPriority != 0){
                if(highestPriority < input.moveDown.priority){
                    highestPriority = input.moveDown.priority;
                    answere = "down";
                }
            }else{
                highestPriority = input.moveDown.priority;
                answere = "down";
            }
        }
        if(input.moveLeft.available){
            if(highestPriority != 0){
                if(highestPriority < input.moveLeft.priority){
                    highestPriority = input.moveLeft.priority;
                    answere = "left";
                }
            }else{
                highestPriority = input.moveLeft.priority;
                answere = "left";
            }
        }
        if(input.moveRight.available){
            if(highestPriority != 0){
                if(highestPriority < input.moveRight.priority){
                    highestPriority = input.moveRight.priority;
                    answere = "right";
                }
            }else{
                highestPriority = input.moveRight.priority;
                answere = "right";
            }
        }

        return answere;

    }

    private nextStepForLoop(): {[key: string]: priorityMove}{
        let ownHead = this.gameState.you.head;
        let ownTail = this.gameState.you.body[this.gameState.you.body.length - 1];

        let closestFood = this.giveClosestFood();
        if(closestFood){
            if(this.calculateDistanceToNextSnakeHead() < (this.calculateDistanceBetweenCoords(ownHead, closestFood)) + 3){
                /* return this.nextStepForFood(); */
            }
        }
        
        let priorityMoves: {[key: string]: priorityMove} = {
            moveUp: {available: true, priority: 0},
            moveDown: {available: true, priority: 0},
            moveLeft: {available: true, priority: 0},
            moveRight: {available: true, priority: 0}
        };

        

        this.upgradePlayboardForLoop();
        /* this.playboard.occupieFieldsWithThreeOccupiedNeighbours(); */

        let neighbours = this.playboard.getNeighbours(ownHead);

        //add occpied for othter snakes...
        if(neighbours){
            console.log("found neighbours!");
            if(!neighbours.above || neighbours.above.isOccupied()){
                priorityMoves.moveUp.available = false;
                console.log("upper neighbour is not reachable! (Z. 105)");
            }
            if(!neighbours.below || neighbours.below.isOccupied()){
                priorityMoves.moveDown.available = false;
                console.log("lower neighbour is not reachable! (Z. 109)");
            }
            if(!neighbours.left || neighbours.left.isOccupied()){
                priorityMoves.moveLeft.available = false;
                console.log("left neighbour is not reachable! (Z. 113)");
            }
            if(!neighbours.right || neighbours.right.isOccupied()){
                priorityMoves.moveRight.available = false;
                console.log("right neighbour is not reachable! (Z. 117)");
            }
        }else{
            priorityMoves.moveUp.available = false;
            priorityMoves.moveDown.available = false;
            priorityMoves.moveLeft.available = false;
            priorityMoves.moveRight.available = false;
            console.log("no neighbour is reachable! (Z. 124)");
        }

        let shortestDistance: number | undefined;
        let shortestDistanceDirection: string = "";
        let currentPriority: number = 0;

        if(priorityMoves.moveUp.available){
            let currentDistance = this.calculateDistanceBetweenCoords({x: ownHead.x, y: ownHead.y + 1}, ownTail);
            if(shortestDistance){
                if(currentDistance < shortestDistance){
                    shortestDistance = currentDistance;
                    currentPriority++;
                    priorityMoves.moveUp.priority = currentPriority;
                    shortestDistanceDirection = "up";
                }else if(currentDistance === shortestDistance){
                    switch(shortestDistanceDirection){
                        case "up":
                            
                        case "down": {
                            this.playboard.setForAllFieldsVisited(false);
                            let freeFieldsUp: number = this.countFreeFields({x: ownHead.x, y: ownHead.y + 1}, 0);
                            this.playboard.setForAllFieldsVisited(false);
                            let freeFieldsDown: number = this.countFreeFields({x: ownHead.x, y: ownHead.y - 1}, 0);
                            if(freeFieldsUp > freeFieldsDown){
                                currentPriority++;
                                priorityMoves.up.priority = currentPriority;
                            }else if(freeFieldsUp < freeFieldsDown){
                                currentPriority++;
                                priorityMoves.down.priority = currentPriority;
                            }else if(freeFieldsUp === freeFieldsDown){
                                currentPriority++;
                                priorityMoves.down.priority = currentPriority;
                                priorityMoves.up.priority = currentPriority;
                            }
                            break;
                        }
                        case "left": {
                            this.playboard.setForAllFieldsVisited(false);
                            let freeFieldsUp: number = this.countFreeFields({x: ownHead.x, y: ownHead.y + 1}, 0);
                            this.playboard.setForAllFieldsVisited(false);
                            let freeFieldsLeft: number = this.countFreeFields({x: ownHead.x - 1, y: ownHead.y}, 0);
                            if(freeFieldsUp > freeFieldsLeft){
                                currentPriority++;
                                priorityMoves.up.priority = currentPriority;
                            }else if(freeFieldsUp < freeFieldsLeft){
                                currentPriority++;
                                priorityMoves.left.priority = currentPriority;
                            }else if(freeFieldsUp === freeFieldsLeft){
                                currentPriority++;
                                priorityMoves.left.priority = currentPriority;
                                priorityMoves.up.priority = currentPriority;
                            }
                            break;
                        }
                        case "right": {
                            this.playboard.setForAllFieldsVisited(false);
                            let freeFieldsUp: number = this.countFreeFields({x: ownHead.x, y: ownHead.y + 1}, 0);
                            this.playboard.setForAllFieldsVisited(false);
                            let freeFieldsRight: number = this.countFreeFields({x: ownHead.x + 1, y: ownHead.y}, 0);
                            if(freeFieldsUp > freeFieldsRight){
                                currentPriority++;
                                priorityMoves.up.priority = currentPriority;
                            }else if(freeFieldsUp < freeFieldsRight){
                                currentPriority++;
                                priorityMoves.right.priority = currentPriority;
                            }else if(freeFieldsUp === freeFieldsRight){
                                currentPriority++;
                                priorityMoves.right.priority = currentPriority;
                                priorityMoves.up.priority = currentPriority;
                            }
                            break;
                        }
                    }
                }
            }else{
                shortestDistance = currentDistance;
                currentPriority++;
                priorityMoves.moveUp.priority = currentPriority;
                shortestDistanceDirection = "up";
            }
        }
        if(priorityMoves.moveDown.available){
            let currentDistance = this.calculateDistanceBetweenCoords({x: ownHead.x, y: ownHead.y - 1}, ownTail);
            if(shortestDistance){
                if(currentDistance < shortestDistance){
                    shortestDistance = currentDistance;
                    currentPriority++;
                    priorityMoves.moveDown.priority = currentPriority;
                    shortestDistanceDirection = "down";
                }else if(currentDistance === shortestDistance){
                    switch(shortestDistanceDirection){
                        case "up":
                            this.playboard.setForAllFieldsVisited(false);
                            let freeFieldsUp: number = this.countFreeFields({x: ownHead.x, y: ownHead.y + 1}, 0);
                            this.playboard.setForAllFieldsVisited(false);
                            let freeFieldsDown: number = this.countFreeFields({x: ownHead.x, y: ownHead.y - 1}, 0);
                            if(freeFieldsUp > freeFieldsDown){
                                currentPriority++;
                                priorityMoves.up.priority = currentPriority;
                            }else if(freeFieldsUp < freeFieldsDown){
                                currentPriority++;
                                priorityMoves.down.priority = currentPriority;
                            }else if(freeFieldsUp === freeFieldsDown){
                                currentPriority++;
                                priorityMoves.down.priority = currentPriority;
                                priorityMoves.up.priority = currentPriority;
                            }
                            break;
                        case "down": {
                           
                        }
                        case "left": {
                            this.playboard.setForAllFieldsVisited(false);
                            let freeFieldsDown: number = this.countFreeFields({x: ownHead.x, y: ownHead.y - 1}, 0);
                            this.playboard.setForAllFieldsVisited(false);
                            let freeFieldsLeft: number = this.countFreeFields({x: ownHead.x - 1, y: ownHead.y}, 0);
                            if(freeFieldsDown > freeFieldsLeft){
                                currentPriority++;
                                priorityMoves.down.priority = currentPriority;
                            }else if(freeFieldsDown < freeFieldsLeft){
                                currentPriority++;
                                priorityMoves.left.priority = currentPriority;
                            }else if(freeFieldsDown === freeFieldsLeft){
                                currentPriority++;
                                priorityMoves.left.priority = currentPriority;
                                priorityMoves.down.priority = currentPriority;
                            }
                            break;
                        }
                        case "right": {
                            this.playboard.setForAllFieldsVisited(false);
                            let freeFieldsDown: number = this.countFreeFields({x: ownHead.x, y: ownHead.y - 1}, 0);
                            this.playboard.setForAllFieldsVisited(false);
                            let freeFieldsRight: number = this.countFreeFields({x: ownHead.x + 1, y: ownHead.y}, 0);
                            if(freeFieldsDown > freeFieldsRight){
                                currentPriority++;
                                priorityMoves.down.priority = currentPriority;
                            }else if(freeFieldsDown < freeFieldsRight){
                                currentPriority++;
                                priorityMoves.right.priority = currentPriority;
                            }else if(freeFieldsDown === freeFieldsRight){
                                currentPriority++;
                                priorityMoves.right.priority = currentPriority;
                                priorityMoves.down.priority = currentPriority;
                            }
                            break;
                        }
                    }
                }
            }else{
                shortestDistance = currentDistance;
                currentPriority++;
                priorityMoves.moveDown.priority = currentPriority;
                shortestDistanceDirection = "down";
            }
        }
        if(priorityMoves.moveLeft.available){
            let currentDistance = this.calculateDistanceBetweenCoords({x: ownHead.x - 1, y: ownHead.y}, ownTail);
            if(shortestDistance){
                if(currentDistance < shortestDistance){
                    shortestDistance = currentDistance;
                    currentPriority++;
                    priorityMoves.moveLeft.priority = currentPriority;
                    shortestDistanceDirection = "left";
                }else if(currentDistance === shortestDistance){
                    switch(shortestDistanceDirection){
                        case "up":
                            this.playboard.setForAllFieldsVisited(false);
                            let freeFieldsUp: number = this.countFreeFields({x: ownHead.x, y: ownHead.y + 1}, 0);
                            this.playboard.setForAllFieldsVisited(false);
                            let freeFieldsLeft: number = this.countFreeFields({x: ownHead.x - 1, y: ownHead.y}, 0);
                            if(freeFieldsUp > freeFieldsLeft){
                                currentPriority++;
                                priorityMoves.up.priority = currentPriority;
                            }else if(freeFieldsUp < freeFieldsLeft){
                                currentPriority++;
                                priorityMoves.left.priority = currentPriority;
                            }else if(freeFieldsUp === freeFieldsLeft){
                                currentPriority++;
                                priorityMoves.left.priority = currentPriority;
                                priorityMoves.up.priority = currentPriority;
                            }
                            break;
                        case "down": {
                            this.playboard.setForAllFieldsVisited(false);
                            let freeFieldsDown: number = this.countFreeFields({x: ownHead.x, y: ownHead.y - 1}, 0);
                            this.playboard.setForAllFieldsVisited(false);
                            let freeFieldsLeft: number = this.countFreeFields({x: ownHead.x - 1, y: ownHead.y}, 0);
                            if(freeFieldsDown > freeFieldsLeft){
                                currentPriority++;
                                priorityMoves.down.priority = currentPriority;
                            }else if(freeFieldsDown < freeFieldsLeft){
                                currentPriority++;
                                priorityMoves.left.priority = currentPriority;
                            }else if(freeFieldsDown === freeFieldsLeft){
                                currentPriority++;
                                priorityMoves.down.priority = currentPriority;
                                priorityMoves.left.priority = currentPriority;
                            }
                            break;
                        }
                        case "left": {
                            
                        }
                        case "right": {
                            this.playboard.setForAllFieldsVisited(false);
                            let freeFieldsLeft: number = this.countFreeFields({x: ownHead.x - 1, y: ownHead.y}, 0);
                            this.playboard.setForAllFieldsVisited(false);
                            let freeFieldsRight: number = this.countFreeFields({x: ownHead.x + 1, y: ownHead.y}, 0);
                            if(freeFieldsLeft > freeFieldsRight){
                                currentPriority++;
                                priorityMoves.left.priority = currentPriority;
                            }else if(freeFieldsLeft < freeFieldsRight){
                                currentPriority++;
                                priorityMoves.right.priority = currentPriority;
                            }else if(freeFieldsLeft === freeFieldsRight){
                                currentPriority++;
                                priorityMoves.right.priority = currentPriority;
                                priorityMoves.left.priority = currentPriority;
                            }
                            break;
                        }
                    }
                }
            }else{
                shortestDistance = currentDistance;
                currentPriority++;
                priorityMoves.moveLeft.priority = currentPriority;
                shortestDistanceDirection = "left";
            }
        }
        if(priorityMoves.moveRight.available){
            let currentDistance = this.calculateDistanceBetweenCoords({x: ownHead.x + 1, y: ownHead.y}, ownTail);
            if(shortestDistance){
                if(currentDistance < shortestDistance){
                    shortestDistance = currentDistance;
                    currentPriority++;
                    priorityMoves.moveRight.priority = currentPriority;
                    shortestDistanceDirection = "right";
                }else if(currentDistance === shortestDistance){
                    switch(shortestDistanceDirection){
                        case "up":
                            this.playboard.setForAllFieldsVisited(false);
                            let freeFieldsUp: number = this.countFreeFields({x: ownHead.x, y: ownHead.y + 1}, 0);
                            this.playboard.setForAllFieldsVisited(false);
                            let freeFieldsRight: number = this.countFreeFields({x: ownHead.x + 1, y: ownHead.y}, 0);
                            if(freeFieldsUp > freeFieldsRight){
                                currentPriority++;
                                priorityMoves.up.priority = currentPriority;
                            }else if(freeFieldsUp < freeFieldsRight){
                                currentPriority++;
                                priorityMoves.right.priority = currentPriority;
                            }else if(freeFieldsUp === freeFieldsRight){
                                currentPriority++;
                                priorityMoves.right.priority = currentPriority;
                                priorityMoves.up.priority = currentPriority;
                            }
                            break;
                        case "down": {
                            this.playboard.setForAllFieldsVisited(false);
                            let freeFieldsDown: number = this.countFreeFields({x: ownHead.x, y: ownHead.y - 1}, 0);
                            this.playboard.setForAllFieldsVisited(false);
                            let freeFieldsRight: number = this.countFreeFields({x: ownHead.x + 1, y: ownHead.y}, 0);
                            if(freeFieldsDown > freeFieldsRight){
                                currentPriority++;
                                priorityMoves.down.priority = currentPriority;
                            }else if(freeFieldsDown < freeFieldsRight){
                                currentPriority++;
                                priorityMoves.right.priority = currentPriority;
                            }else if(freeFieldsDown === freeFieldsRight){
                                currentPriority++;
                                priorityMoves.down.priority = currentPriority;
                                priorityMoves.right.priority = currentPriority;
                            }
                            break;
                        }
                        case "left": {
                            this.playboard.setForAllFieldsVisited(false);
                            let freeFieldsRight: number = this.countFreeFields({x: ownHead.x + 1, y: ownHead.y}, 0);
                            this.playboard.setForAllFieldsVisited(false);
                            let freeFieldsLeft: number = this.countFreeFields({x: ownHead.x - 1, y: ownHead.y}, 0);
                            if(freeFieldsRight > freeFieldsLeft){
                                currentPriority++;
                                priorityMoves.right.priority = currentPriority;
                            }else if(freeFieldsRight < freeFieldsLeft){
                                currentPriority++;
                                priorityMoves.left.priority = currentPriority;
                            }else if(freeFieldsRight === freeFieldsLeft){
                                currentPriority++;
                                priorityMoves.left.priority = currentPriority;
                                priorityMoves.right.priority = currentPriority;
                            }
                            break;
                        }
                        case "right": {
                            
                        }
                    }
                }
            }else{
                shortestDistance = currentDistance;
                currentPriority++;
                priorityMoves.moveRight.priority = currentPriority;
                shortestDistanceDirection = "right";
            }
        }

        console.log("array for moves: ");

        console.log("up: " + priorityMoves.moveUp.available + " | " + priorityMoves.moveUp.priority);
        console.log("down: " + priorityMoves.moveDown.available + " | " + priorityMoves.moveDown.priority);
        console.log("left: " + priorityMoves.moveLeft.available + " | " + priorityMoves.moveLeft.priority);
        console.log("right: " + priorityMoves.moveRight.available + " | " + priorityMoves.moveRight.priority);

        return priorityMoves;
    }

    /* private nextStepForFood(): {[key: string]: priorityMove}{
        //after implementing loop Methode
    } */

    private countFreeFields(coord: Coord, counter: number): number{

        let ownHead: Coord = this.gameState.you.head;
        let currentField: Playfield | undefined = this.playboard.getPlayField(coord);
        let neighbours = this.playboard.getNeighbours(coord);

        let visitAbove: boolean = true;
        let visitBelow: boolean = true;
        let visitLeft: boolean = true;
        let visitRight: boolean = true;

        //check for current field
        if(currentField && !(currentField.isOccupied())){
            currentField.setVisited(true);
            this.playboard.overwrite(coord, currentField);
            counter++;
        }else{
            return counter;
        }

        if(neighbours){
            //check for visited fields
            if(neighbours.above === undefined || neighbours.above.alreadyVisited()){
                visitAbove = false;
            }
            if(neighbours.below === undefined || neighbours.below.alreadyVisited()){
                visitBelow = false;
            }
            if(neighbours.left === undefined || neighbours.left.alreadyVisited()){
                visitLeft = false;
            }
            if(neighbours.right === undefined || neighbours.right.alreadyVisited()){
                visitRight = false;
            }

            //check for occupied fields
            if(neighbours.above?.isOccupied()){
                let timeOccupied: number | undefined = neighbours.above.isOccupiedFor();
                if(timeOccupied){
                    if(!(timeOccupied < this.calculateDistanceBetweenCoords(ownHead, coord))){
                        visitAbove = false;
                    }
                }else{
                    visitAbove = false;
                }
            }

            if(neighbours.below?.isOccupied()){
                let timeOccupied: number | undefined = neighbours.below.isOccupiedFor();
                if(timeOccupied){
                    if(!(timeOccupied < this.calculateDistanceBetweenCoords(ownHead, coord))){
                        visitBelow = false;
                    }
                }else{
                    visitBelow = false;
                }
            }

            if(neighbours.left?.isOccupied()){
                let timeOccupied: number | undefined = neighbours.left.isOccupiedFor();
                if(timeOccupied){
                    if(!(timeOccupied < this.calculateDistanceBetweenCoords(ownHead, coord))){
                        visitLeft = false;
                    }
                }else{
                    visitLeft = false;
                }
            }

            if(neighbours.right?.isOccupied()){
                let timeOccupied: number | undefined = neighbours.right.isOccupiedFor();
                if(timeOccupied){
                    if(!(timeOccupied < this.calculateDistanceBetweenCoords(ownHead, coord))){
                        visitRight = false;
                    }
                }else{
                    visitRight = false;
                }
            }
        }else{
            visitAbove = false;
            visitBelow = false;
            visitLeft = false;
            visitRight = false;
        }

        if(visitAbove){
            counter += this.countFreeFields({x: coord.x, y: coord.y + 1}, 0);
        }
        if(visitBelow){
            counter += this.countFreeFields({x: coord.x, y: coord.y - 1}, 0);
        }
        if(visitLeft){
            counter += this.countFreeFields({x: coord.x - 1, y: coord.y}, 0);
        }
        if(visitRight){
            counter += this.countFreeFields({x: coord.x + 1, y: coord.y}, 0);
        }

        console.log("iteration " + coord.x + "|" + coord.y + ":" + counter);

        return counter;

    }

    private calculateDistanceToNextSnakeHead(): number{
        let ownHead = this.gameState.you.head;
        let smallestDistance = 0;
        if(this.battlesnakes[0].id != this.gameState.you.id){
            smallestDistance = this.calculateDistanceBetweenCoords(ownHead, this.battlesnakes[0].body[0]);
            for(let index: number = 1; index < this.battlesnakes.length; index ++){
                if(this.battlesnakes[index].id === this.gameState.you.id){
                    index++;
                }else{
                    let currentDistance = this.calculateDistanceBetweenCoords(ownHead, this.battlesnakes[index].body[0]);
                    if(currentDistance < smallestDistance){
                        smallestDistance = currentDistance;
                    }
                }
            }
        }else{
            smallestDistance = this.calculateDistanceBetweenCoords(ownHead, this.battlesnakes[1].body[0]);
            for(let index = 2; index < this.battlesnakes.length; index++){
                let currentDistance = this.calculateDistanceBetweenCoords(ownHead, this.battlesnakes[index].body[0]);
                    if(currentDistance < smallestDistance){
                        smallestDistance = currentDistance;
                    }
            }
        }
        return smallestDistance;
    }

    private upgradePlayboardForLoop(): void{
        //set food coord to occupied false:
        for(let index = 0; index < this.food.length; index++){
            let currentField = this.playboard.getPlayField(this.food[index]);
            if(currentField){
                currentField.setOccupied(true);
                this.playboard.overwrite(this.food[index], currentField);
            }
        }
    }

    private upgradePlayboardInformation(): void{
  
        //checkForOtherSnakes:
        for(let indexForSnakeArray = 0; indexForSnakeArray < this.battlesnakes.length; indexForSnakeArray++){
            for(let indexForSnakeBody = 0; indexForSnakeBody < this.battlesnakes[indexForSnakeArray].length; indexForSnakeBody++){
                let currentField = this.playboard.getPlayField(this.battlesnakes[indexForSnakeArray].body[indexForSnakeBody]);
                if(currentField){
                    let coordOfCurrentField = currentField.getCoord();
                    if(coordOfCurrentField){
                        currentField.setOccupied(true);
                        currentField.setOccupiedFor(this.battlesnakes[indexForSnakeArray].body.length - indexForSnakeBody);
                        currentField.setDistanceToOwnHead(this.calculateDistanceBetweenCoords(coordOfCurrentField, this.gameState.you.head));
                        this.playboard.overwrite(coordOfCurrentField, currentField);
                    }
                }
            }
        }

        //checkForHazards:
        for(let index = 0; index < this.hazards.length; index++){
            let currentField = this.playboard.getPlayField(this.hazards[index]);
            let coordOfCurrentField = currentField?.getCoord();
            if(currentField && coordOfCurrentField){
                currentField.setOccupied(true);
                this.playboard.overwrite(coordOfCurrentField, currentField);
            }
        
        }
              
    }

    private calculateBehaviour(): string{
        const loop: string = "loopMode";
        const hungry: string = "hungryMode";
        const agressive: string = "battleMode";

        const ownHead: Coord = this.gameState.you.head;

        //default value is hungry
        let returnValue: string = hungry;

        if(this.battlesnakes.length === 1){
            //if only snake on the board
            const closestFood = this.giveClosestFood();
            if(closestFood){
                const distanceToFood = this.calculateDistanceBetweenCoords(ownHead, closestFood);
                if(this.gameState.you.health <= distanceToFood + 5){
                    //if health is low
                    returnValue = hungry;
                }else{
                    //if health is high
                    returnValue = loop;
                }
            }
        }else{
            //if play against other snakes
            const ownLength = this.gameState.you.length;
            let biggestEnemy: number = this.battlesnakes[0].body.length;
            
            for(let indexForSnakeArray = 1; indexForSnakeArray < this.battlesnakes.length; indexForSnakeArray++){
               if(this.battlesnakes[indexForSnakeArray].length > biggestEnemy && this.battlesnakes[indexForSnakeArray].id != this.gameState.you.id){
                    biggestEnemy = this.battlesnakes[indexForSnakeArray].body.length;
               }
            }

            if(ownLength > biggestEnemy){
                //biggest snake on playfield
                returnValue = agressive;
            }else{
                returnValue = hungry;
            }
        }

        return returnValue;
    }

    private giveClosestFood(): Coord | undefined{
        let closestFood: Coord | undefined = undefined;
        if(this.food.length != 0){
            closestFood = this.food[0];
        }
        const ownHead: Coord = this.gameState.you.head;
        for(let index = 1; index < this.food.length; index ++){
            if(closestFood){
                if(this.calculateDistanceBetweenCoords(ownHead, this.food[index]) < 
                this.calculateDistanceBetweenCoords(ownHead, closestFood)){
                    closestFood = this.food[index];
                }
            }
        }
        return closestFood;
    }

    private calculateDistanceBetweenCoords(coord1: Coord, coord2: Coord): number{
        let distance: number = Math.abs(coord1.x - coord2.x) + Math.abs(coord1.y - coord2.y);
        return distance;
    }
}