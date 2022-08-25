import { InfoResponse, GameState, MoveResponse, Game } from "./types"

export function info(): InfoResponse {
    console.log("INFO")
    const response: InfoResponse = {
        apiversion: "1",
        author: "",
        color: "#ff19e0",
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

    var loopMode: boolean = false;
    var eatMode: boolean = false;
    var attackMode: boolean = false;

    var playField: fieldHorizontal[] = initPlayField(gameState);



    // Step 0: Don't let your Battlesnake move back on it's own neck

    // TODO: Step 1 - Don't hit walls.
    // Use information in gameState to prevent your Battlesnake from moving beyond the boundaries of the board.
    // const boardWidth = gameState.board.width
    // const boardHeight = gameState.board.height

    // TODO: Step 2 - Don't hit yourself.
    // Use information in gameState to prevent your Battlesnake from colliding with itself.
    // const mybody = gameState.you.body

    // TODO: Step 3 - Don't collide with others.
    // Use information in gameState to prevent your Battlesnake from colliding with others.

    // TODO: Step 4 - Find food.
    // Use information in gameState to seek out and find food.

    // Finally, choose a move from the available safe moves.
    // TODO: Step 5 - Select a move to make based on strategy, rather than random.
    const safeMoves = Object.keys(possibleMoves).filter(key => possibleMoves[key])
    const response: MoveResponse = {
        move: safeMoves[Math.floor(Math.random() * safeMoves.length)],
    }

    console.log(`${gameState.game.id} MOVE ${gameState.turn}: ${response.move}`)
    return response
}

interface fieldHorizontal{
    fieldsAbove: fieldVertical[];
}

interface fieldVertical{
    score: number;
    occupied: boolean;
}

function initPlayField(gameState: GameState): fieldHorizontal[]{

    var fieldWidth: number = gameState.board.width;
    var fieldHeight: number = gameState.board.height;

    var hazardWalls = gameState.board.hazards;
    var otherSnakes = gameState.board.snakes;
    var food = gameState.board.food;

    var playField: fieldHorizontal[] = new Array();

    for(var indexForWidth: number = 0; indexForWidth < fieldWidth; indexForWidth++){
        var currentField: fieldHorizontal;
        var verticalFields: fieldVertical[] = new Array;
        for(var indexForHeight: number = 0; indexForHeight < fieldHeight; indexForHeight++){
            var tmpField: fieldVertical = {occupied: false, score: 100}
            verticalFields.push(tmpField);
        }
        currentField = {fieldsAbove: verticalFields};
        playField.push(currentField);
    }

    if(hazardWalls.length != 0){
        for(var indexForHazardArray:number = 0; indexForHazardArray < hazardWalls.length; indexForHazardArray++){
            playField[hazardWalls[indexForHazardArray].x].fieldsAbove[hazardWalls[indexForHazardArray].y].occupied = true;
            playField[hazardWalls[indexForHazardArray].x].fieldsAbove[hazardWalls[indexForHazardArray].y].score = 0;
        }
    }

    if(food.length != 0){
        for(var indexForFoodArray = 0; indexForFoodArray < food.length; indexForFoodArray++){
            playField[food[indexForFoodArray].x].fieldsAbove[food[indexForFoodArray].y].score = 500;
        }
    }

    if(otherSnakes.length != 0){
        for(var indexForSnakeArray:number = 0; indexForSnakeArray < otherSnakes.length; indexForSnakeArray++){
            for(var indexForSnakeBody: number = 0; indexForSnakeBody < otherSnakes[indexForSnakeArray].body.length; indexForSnakeBody++){
                playField[otherSnakes[indexForSnakeArray].body[indexForSnakeBody].x].fieldsAbove[otherSnakes[indexForSnakeArray].body[indexForSnakeBody].y].occupied = true;
                playField[otherSnakes[indexForSnakeArray].body[indexForSnakeBody].x].fieldsAbove[otherSnakes[indexForSnakeArray].body[indexForSnakeBody].y].score = -100;
            }
        }
    }

    playField = flatFieldArray(playField);
    return playField;
}


function flatFieldArray(playField: fieldHorizontal[]): fieldHorizontal[]{

    var rightFieldAvailable: boolean = true;
    var leftFieldAvailable: boolean = true;
    var upperFieldAvailable: boolean = true;
    var lowerFieldAvailable: boolean = true;
    
    for(var indexForWidth: number = 0; indexForWidth < playField.length; indexForWidth++){
        for(var indexForHeight: number = 0; indexForHeight < playField[indexForWidth].fieldsAbove.length; indexForHeight++){
            if(indexForWidth === 0){
                leftFieldAvailable = false;
            }else if(indexForWidth === playField.length - 1){
                rightFieldAvailable = false;
            }
            if(indexForHeight === 0){
                lowerFieldAvailable = false;
            }else if(indexForHeight === playField[indexForWidth].fieldsAbove.length - 1){
                upperFieldAvailable = false;
            }

            var averageVal: number = 100;

            if(rightFieldAvailable && leftFieldAvailable && upperFieldAvailable && lowerFieldAvailable){
                var scoreOfUpperField: number = playField[indexForWidth].fieldsAbove[indexForHeight + 1].score;
                var scoreOfLowerField: number = playField[indexForWidth].fieldsAbove[indexForHeight - 1].score;
                var scoreOfRightField: number = playField[indexForWidth + 1].fieldsAbove[indexForHeight].score;
                var scoreOfLeftField: number = playField[indexForWidth - 1].fieldsAbove[indexForHeight].score;

                var scoreOfCurrentField: number = playField[indexForWidth].fieldsAbove[indexForHeight].score;

                averageVal = (scoreOfCurrentField + scoreOfLeftField + scoreOfRightField + scoreOfUpperField + scoreOfLowerField) / 5;

            }else if(rightFieldAvailable && upperFieldAvailable && lowerFieldAvailable){
                var scoreOfUpperField: number = playField[indexForWidth].fieldsAbove[indexForHeight + 1].score;
                var scoreOfLowerField: number = playField[indexForWidth].fieldsAbove[indexForHeight - 1].score;
                var scoreOfRightField: number = playField[indexForWidth + 1].fieldsAbove[indexForHeight].score;

                var scoreOfCurrentField: number = playField[indexForWidth].fieldsAbove[indexForHeight].score;

                averageVal = (scoreOfCurrentField + scoreOfRightField + scoreOfUpperField + scoreOfLowerField) / 4;

            }else if(upperFieldAvailable && rightFieldAvailable){
                var scoreOfUpperField: number = playField[indexForWidth].fieldsAbove[indexForHeight + 1].score;
                var scoreOfRightField: number = playField[indexForWidth + 1].fieldsAbove[indexForHeight].score;

                var scoreOfCurrentField: number = playField[indexForWidth].fieldsAbove[indexForHeight].score;

                averageVal = (scoreOfCurrentField + scoreOfRightField + scoreOfUpperField) / 3;

            }else if(lowerFieldAvailable && rightFieldAvailable){
                var scoreOfLowerField: number = playField[indexForWidth].fieldsAbove[indexForHeight - 1].score;
                var scoreOfRightField: number = playField[indexForWidth + 1].fieldsAbove[indexForHeight].score;

                var scoreOfCurrentField: number = playField[indexForWidth].fieldsAbove[indexForHeight].score;

                averageVal = (scoreOfCurrentField + scoreOfRightField  + scoreOfLowerField) / 3;

            }else if(leftFieldAvailable && lowerFieldAvailable){
                var scoreOfLowerField: number = playField[indexForWidth].fieldsAbove[indexForHeight - 1].score;
                var scoreOfLeftField: number = playField[indexForWidth - 1].fieldsAbove[indexForHeight].score;

                var scoreOfCurrentField: number = playField[indexForWidth].fieldsAbove[indexForHeight].score;

                averageVal = (scoreOfCurrentField + scoreOfLeftField + scoreOfLowerField) / 3;

            }else if(leftFieldAvailable && upperFieldAvailable){
                var scoreOfUpperField: number = playField[indexForWidth].fieldsAbove[indexForHeight + 1].score;
                var scoreOfLeftField: number = playField[indexForWidth - 1].fieldsAbove[indexForHeight].score;

                var scoreOfCurrentField: number = playField[indexForWidth].fieldsAbove[indexForHeight].score;

                averageVal = (scoreOfCurrentField + scoreOfLeftField + scoreOfUpperField) / 3;

            }else if(leftFieldAvailable && upperFieldAvailable && lowerFieldAvailable){
                var scoreOfUpperField: number = playField[indexForWidth].fieldsAbove[indexForHeight + 1].score;
                var scoreOfLowerField: number = playField[indexForWidth].fieldsAbove[indexForHeight - 1].score;
                var scoreOfLeftField: number = playField[indexForWidth - 1].fieldsAbove[indexForHeight].score;

                var scoreOfCurrentField: number = playField[indexForWidth].fieldsAbove[indexForHeight].score;

                averageVal = (scoreOfCurrentField + scoreOfLeftField + scoreOfUpperField + scoreOfLowerField) / 4;

            }

            playField[indexForWidth].fieldsAbove[indexForHeight].score = averageVal;
        }
    }

    return playField;
}