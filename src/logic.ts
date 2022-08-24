import { InfoResponse, GameState, MoveResponse, Game } from "./types"

export function info(): InfoResponse {
    console.log("INFO")
    const response: InfoResponse = {
        apiversion: "1",
        author: "",
        color: "#dd19e0",
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

    // Step 0: Don't let your Battlesnake move back on it's own neck
    const myHead = gameState.you.head
    const myNeck = gameState.you.body[1]
    if (myNeck.x < myHead.x) {
        possibleMoves.left = false
    } else if (myNeck.x > myHead.x) {
        possibleMoves.right = false
    } else if (myNeck.y < myHead.y) {
        possibleMoves.down = false
    } else if (myNeck.y > myHead.y) {
        possibleMoves.up = false
    }

    // TODO: Step 1 - Don't hit walls.
    const boardWidht: number = gameState.board.width;
    const boardHeight: number = gameState.board.height;

    if(gameState.you.head.x === boardWidht - 1){
        possibleMoves.right = false;
    }
    if(gameState.you.head.x === 0){
        possibleMoves.left = false;
    }
    if(gameState.you.head.y === boardHeight - 1){
        possibleMoves.up = false;
    }
    if(gameState.you.head.y === 0){
        possibleMoves.down = false;
    }

    // TODO: Step 2 - Don't hit yourself.
    for(var index = 1; index < gameState.you.body.length; index++){
        if(gameState.you.body[index].y === gameState.you.body[0].y - 1 && gameState.you.body[index].x === gameState.you.body[0].x){
            possibleMoves.down = false;
        }
        if(gameState.you.body[index].y === gameState.you.body[0].y + 1 && gameState.you.body[index].x === gameState.you.body[0].x){
            possibleMoves.up = false;
        }
        if(gameState.you.body[index].x === gameState.you.body[0].x - 1 && gameState.you.body[index].y === gameState.you.body[0].y){
            possibleMoves.left = false;
        }
        if(gameState.you.body[index].x === gameState.you.body[0].x + 1 && gameState.you.body[index].y === gameState.you.body[0].y){
            possibleMoves.right = false;
        }
    }

    // TODO: Step 3 - Don't collide with others.
    for(var index = 0; index < gameState.board.snakes.length; index++){
        for(var index2 = 0; index2 < gameState.board.snakes[index].body.length; index2++){
            if(gameState.you.body[0].y + 1 === gameState.board.snakes[index].body[index2].y && gameState.you.body[0].x === gameState.board.snakes[index].body[index2].x){
                possibleMoves.up = false;            
            }
            if(gameState.you.body[0].y - 1 === gameState.board.snakes[index].body[index2].y && gameState.you.body[0].x === gameState.board.snakes[index].body[index2].x){
                possibleMoves.down = false;            
            }
            if(gameState.you.body[0].x + 1 === gameState.board.snakes[index].body[index2].x && gameState.you.body[0].y === gameState.board.snakes[index].body[index2].y){
                possibleMoves.right = false;            
            }
            if(gameState.you.body[0].x - 1 === gameState.board.snakes[index].body[index2].x && gameState.you.body[0].y === gameState.board.snakes[index].body[index2].y){
                possibleMoves.left  = false;            
            }
        }
    }


    //check for hazard
    if(gameState.board.hazards.length != 0){
        for(var index = 0; index < gameState.board.hazards.length; index++){
            if(gameState.you.body[0].x + 1 === gameState.board.hazards[index].x && gameState.you.body[0].y === gameState.board.hazards[index].y){
                possibleMoves.right = false;
            }
            if(gameState.you.body[0].x - 1 === gameState.board.hazards[index].x && gameState.you.body[0].y === gameState.board.hazards[index].y){
                possibleMoves.left = false;
            }
            if(gameState.you.body[0].y + 1 === gameState.board.hazards[index].y && gameState.you.body[0].x === gameState.board.hazards[index].x){
                possibleMoves.up = false;
            }
            if(gameState.you.body[0].y - 1 === gameState.board.hazards[index].y && gameState.you.body[0].x === gameState.board.hazards[index].x){
                possibleMoves.down = false;
            }
        }
    }

    // TODO: Step 4 - Find food.
    if(gameState.board.food.length != 0){
        var isAbove: boolean = false;
        var isUnder: boolean = false;
        var isRight: boolean = false;
        var isLeft: boolean = false;
        // calculate food position.
        if(gameState.you.body[0].x < gameState.board.food[0].x){
            isRight = true;
        }else if(gameState.you.body[0].x > gameState.board.food[0].x){
            isLeft = true;
        }
        if(gameState.you.body[0].y < gameState.board.food[0].y){
            isAbove = true;
        }else if(gameState.you.body[0].y > gameState.board.food[0].y){
            isUnder = true;
        }
        //calculate priority of options
        if(isAbove && isLeft){
            if(possibleMoves.up && possibleMoves.left){
                possibleMoves.down = false;
                possibleMoves.right = false;
            }else if(possibleMoves.up && !(possibleMoves.left)){
                possibleMoves.down = false;
                possibleMoves.right = false;
            }else if(!(possibleMoves.up) && possibleMoves.left){
                possibleMoves.down = false;
                possibleMoves.right = false;
            }else if(!(possibleMoves.up) && !(possibleMoves.left)){

            }
        }else if(isAbove && isRight){
            if(possibleMoves.up && possibleMoves.right){
                possibleMoves.down = false;
                possibleMoves.left = false;
            }else if(possibleMoves.up && !(possibleMoves.right)){
                possibleMoves.down = false;
                possibleMoves.left = false;
            }else if(!(possibleMoves.up) && possibleMoves.right){
                possibleMoves.down = false;
                possibleMoves.left = false;
            }else if(!(possibleMoves.up) && !(possibleMoves.right)){
            
            }
        }else if(isUnder && isLeft){
            if(possibleMoves.down && possibleMoves.left){
                possibleMoves.up = false;
                possibleMoves.right = false;
            }else if(possibleMoves.down && !(possibleMoves.left)){
                possibleMoves.up = false;
                possibleMoves.right = false;
            }else if(!(possibleMoves.down) && possibleMoves.left){
                possibleMoves.up = false;
                possibleMoves.right = false;
            }else if(!(possibleMoves.down) && !(possibleMoves.left)){
            
            }
        }else if(isUnder && isRight){
            if(possibleMoves.down && possibleMoves.right){
                possibleMoves.up = false;
                possibleMoves.right = false;
            }else if(possibleMoves.down && !(possibleMoves.right)){
                possibleMoves.up = false;
                possibleMoves.left = false;
            }else if(!(possibleMoves.down) && possibleMoves.right){
                possibleMoves.up = false;
                possibleMoves.left = false;
            }else if(!(possibleMoves.down) && !(possibleMoves.right)){
            
            }
        }else if(isAbove){
            if(possibleMoves.up){
                possibleMoves.right = false;
                possibleMoves.left = false;
                possibleMoves.down = false;
            }
        }else if(isRight){
            if(possibleMoves.right){
                possibleMoves.up = false;
                possibleMoves.down = false;
                possibleMoves.left = false;
            }
        }else if(isUnder){
            if(possibleMoves.down){
                possibleMoves.up = false;
                possibleMoves.left = false;
                possibleMoves.right = false;
            }
        }else if(isLeft){
            if(possibleMoves.left){
                possibleMoves.right = false;
                possibleMoves.up = false;
                possibleMoves.down = false;
            }
        }
    }
    

    // Finally, choose a move from the available safe moves.
    // TODO: Step 5 - Select a move to make based on strategy, rather than random.
    const safeMoves = Object.keys(possibleMoves).filter(key => possibleMoves[key])
    const response: MoveResponse = {
        move: safeMoves[Math.floor(Math.random() * safeMoves.length)],
    }

    console.log(`${gameState.game.id} MOVE ${gameState.turn}: ${response.move}`)
    return response;

}