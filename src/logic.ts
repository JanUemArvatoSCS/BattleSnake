import { TwoDimensionalArray } from "./TwoDimensionalArray";
import { InfoResponse, GameState, MoveResponse, Game } from "./types";
import { Gridboard } from "./Gridboard"

export function info(): InfoResponse {
    console.log("INFO")
    const response: InfoResponse = {
        apiversion: "1",
        author: "",
        color: "#888888",
        head: "default",
        tail: "default"
    }
    return response
}

export function start(gameState: GameState): void {
    console.log(`${gameState.game.id} START`)
}

export function end(gameState: GameState): void {
    console.log(`${gameState.game.id} END\n`)
}

export function move(gameState: GameState): MoveResponse {
    let possibleMoves: { [key: string]: boolean } = {
        up: true,
        down: true,
        left: true,
        right: true
    }

    let playboard: Gridboard = new Gridboard(gameState);
    let direction: string = playboard.calculateNextMove();

    console.log("next move: " + direction)

    switch(direction){
        case "up":
            possibleMoves.down = false;
            possibleMoves.left = false;
            possibleMoves.right = false;
            break;
        case "down":
            possibleMoves.up = false;
            possibleMoves.left = false;
            possibleMoves.right = false;
            break;
        case "left":
            possibleMoves.down = false;
            possibleMoves.up = false;
            possibleMoves.right = false;
            break;
        case "right":
            possibleMoves.down = false;
            possibleMoves.left = false;
            possibleMoves.up = false;
            break;
    }
  
    const safeMoves = Object.keys(possibleMoves).filter(key => possibleMoves[key])
    const response: MoveResponse = {
        move: safeMoves[Math.floor(Math.random() * safeMoves.length)],
    }

    console.log(`${gameState.game.id} MOVE ${gameState.turn}: ${response.move}`)
    return response
}


