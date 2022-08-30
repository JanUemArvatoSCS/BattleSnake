import { InfoResponse, GameState, MoveResponse, Game } from "./types";
import { testgiveBoolean } from "./testcase";

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

    let testvalue = new testgiveBoolean(false);

    possibleMoves.up = testvalue.getTestvalue();
    possibleMoves.down = testvalue.getTestvalue();
    possibleMoves.left = testvalue.getTestvalue();
    possibleMoves.up = testvalue.getTestvalue();


    const safeMoves = Object.keys(possibleMoves).filter(key => possibleMoves[key])
    const response: MoveResponse = {
        move: safeMoves[Math.floor(Math.random() * safeMoves.length)],
    }

    console.log(`${gameState.game.id} MOVE ${gameState.turn}: ${response.move}`)
    return response
}


