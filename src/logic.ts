import { InfoResponse, GameState, MoveResponse, Game } from "./types";

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

    //just a test:
    //let testArray:TwoDimensionalArray = new TwoDimensionalArray(gameState.board.width, gameState.board.height);
    //testArray.generateGridFromCoord(gameState.you.head);
    //console.log("finished grid genaration");
    //for(let indexForW = 0; indexForW < gameState.board.width; indexForW++){
        //for(let indexForH = 0; indexForH < gameState.board.width; indexForH++){
            //console.log(testArray.getVector({x: indexForW, y: indexForH})?.getDistanceToOwnHead);
        //}
    //}
    possibleMoves.left = false;
    possibleMoves.up = false;
    possibleMoves.right = false;

    const safeMoves = Object.keys(possibleMoves).filter(key => possibleMoves[key])
    const response: MoveResponse = {
        move: safeMoves[Math.floor(Math.random() * safeMoves.length)],
    }

    console.log(`${gameState.game.id} MOVE ${gameState.turn}: ${response.move}`)
    return response
}


