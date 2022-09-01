import { TwoDimensionalArray } from "./TwoDimensionalArray";
import { InfoResponse, GameState, MoveResponse, Game } from "./types";
import { Playfield } from "./Playfield";

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

    //testcase:
    let twoDimArray: TwoDimensionalArray = new TwoDimensionalArray(5, 5);
    let playFieldWithGrid: Playfield | undefined = twoDimArray.generateGrid({x:3, y: 3});
    if(playFieldWithGrid){
        console.log(playFieldWithGrid.getNeighbours().below?.getDistanceToOwnHead);
    }

    const safeMoves = Object.keys(possibleMoves).filter(key => possibleMoves[key])
    const response: MoveResponse = {
        move: safeMoves[Math.floor(Math.random() * safeMoves.length)],
    }

    console.log(`${gameState.game.id} MOVE ${gameState.turn}: ${response.move}`)
    return response
}


