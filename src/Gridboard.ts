import { TwoDimensionalArray } from "./TwoDimensionalArray";
import { GameState, Battlesnake, Coord, Board } from "./types";
import { Playfield } from "./Playfield";

export class Gridboard {

    private gameState: GameState;
    private food: Coord[];
    private battlesnakes: Battlesnake[];
    private hazards: Coord[];
    private behaviour: string;
    private playboard: TwoDimensionalArray;

    public constructor(gameState: GameState){
        this.gameState = gameState;
        this.food = gameState.board.food;
        this.battlesnakes = gameState.board.snakes;
        this.hazards = gameState.board.hazards;
        this.playboard = new TwoDimensionalArray(this.gameState.board.width, this.gameState.board.height);
        this.behaviour = this.calculateBehaviour();
    }

    public print(): void{
        for(let indexForHeight = (this.playboard.getHeight() - 1); indexForHeight >= 0; indexForHeight--){
            let oneLine: string = "|";
            for(let indexForWidth = 0; indexForHeight < this.playboard.getWidth(); indexForWidth++){
                oneLine += " ";
                oneLine += "(" + this.playboard.getPlayField({x: indexForWidth, y: indexForHeight})?.getCoord()?.x;
                oneLine += ", " + this.playboard.getPlayField({x: indexForWidth, y: indexForHeight})?.getCoord()?.y; + ")"
                oneLine += " |";
            }
            console.log(oneLine);
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
            let biggestEnemy: number = this.battlesnakes[0].length;
            
            for(let indexForSnakeArray = 1; indexForSnakeArray < this.battlesnakes.length; indexForSnakeArray++){
               if(this.battlesnakes[indexForSnakeArray].length > biggestEnemy && this.battlesnakes[indexForSnakeArray].id != this.gameState.you.id){
                    biggestEnemy = this.battlesnakes[indexForSnakeArray].length;
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