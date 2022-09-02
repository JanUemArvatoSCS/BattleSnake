import { TwoDimensionalArray } from "./TwoDimensionalArray";
import { GameState, Battlesnake, Coord, Board } from "./types";
import { Playfield } from "./Playfield";

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