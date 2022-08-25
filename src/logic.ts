import {Coord, InfoResponse, GameState, MoveResponse, Game } from "./types"

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

    var counter: number = 3;

    while (counter != 0){
        playField = flatFieldArray(playField);
        counter--;
    }

    var bestMove: string = calculateBestMove(gameState, playField);

    if(bestMove === "UP"){
        possibleMoves.down = false;
        possibleMoves.left = false;
        possibleMoves.right = false;
    }else if(bestMove === "DOWN"){
        possibleMoves.up = false;
        possibleMoves.left = false;
        possibleMoves.right = false;
    }else if(bestMove === "LEFT"){
        possibleMoves.right = false;
        possibleMoves.up = false;
        possibleMoves.down = false;
    }else if(bestMove === "RIGHT"){
        possibleMoves.left = false;
        possibleMoves.up = false;
        possibleMoves.down = false;
    }

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
            playField[hazardWalls[indexForHazardArray].x].fieldsAbove[hazardWalls[indexForHazardArray].y].score = -1000;
        }
    }

    if(food.length != 0){
        for(var indexForFoodArray = 0; indexForFoodArray < food.length; indexForFoodArray++){
            playField[food[indexForFoodArray].x].fieldsAbove[food[indexForFoodArray].y].score = 2000;
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

            }else if(upperFieldAvailable && leftFieldAvailable && rightFieldAvailable){
                var scoreOfLeftField: number = playField[indexForWidth - 1].fieldsAbove[indexForHeight].score;
                var scoreOfUpperField: number = playField[indexForWidth].fieldsAbove[indexForHeight + 1].score;
                var scoreOfRightField: number = playField[indexForWidth + 1].fieldsAbove[indexForHeight].score;

                var scoreOfCurrentField: number = playField[indexForWidth].fieldsAbove[indexForHeight].score;

                averageVal = (scoreOfCurrentField + scoreOfLeftField + scoreOfUpperField + scoreOfRightField) / 4;
            }else if(leftFieldAvailable && rightFieldAvailable && lowerFieldAvailable){
                var scoreOfLeftField: number = playField[indexForWidth - 1].fieldsAbove[indexForHeight].score;
                var scoreOfRightField: number = playField[indexForWidth + 1].fieldsAbove[indexForHeight].score;
                var scoreOfLowerField: number = playField[indexForWidth].fieldsAbove[indexForHeight - 1].score;

                var scoreOfCurrentField: number = playField[indexForWidth].fieldsAbove[indexForHeight].score;

                averageVal = (scoreOfCurrentField + scoreOfLeftField + scoreOfRightField + scoreOfLowerField) / 4;
            }

            playField[indexForWidth].fieldsAbove[indexForHeight].score = averageVal;
        }
    }

    return playField;
}

function calculateBestMove(gameState: GameState, playField: fieldHorizontal[]): string{

    var positionOfHead: Coord = gameState.you.head;
    var positionOfNeck: Coord = gameState.you.body[1];

    var moveUp: boolean = true;
    var moveDown: boolean = true;
    var moveRight: boolean = true;
    var moveLeft: boolean = true;

    if(positionOfHead.x > positionOfNeck.x){
        moveRight = false;
    }else if(positionOfHead.x < positionOfNeck.x){
        moveLeft = false;
    }else if(positionOfHead.y > positionOfNeck.y){
        moveDown = false;
    }else if(positionOfHead.y < positionOfNeck.y){
        moveUp = false;
    }

    if(positionOfHead.x === gameState.board.width - 1){
        moveRight = false;
    }
    if(positionOfHead.x === 0){
        moveLeft = false;
    }
    if(positionOfHead.y === gameState.board.height - 1){
        moveUp = false;
    }
    if(positionOfHead.y === 0){
        moveDown = false;
    }

    var returnFeedback: string = "";

    if(moveUp && moveDown && moveLeft && moveRight){
        var up: number = checkFieldAbove(positionOfHead, playField);
        var left: number = checkFieldLeft(positionOfHead, playField);
        var right: number = checkFieldRight(positionOfHead, playField);
        var down: number = checkFieldBelow(positionOfHead, playField);

        var max: number = Math.max(down, up, right, left);

        if(max === down){
            returnFeedback = "DOWN";
        }else if(max === up){
            returnFeedback = "UP";
        }else if(max === right){
            returnFeedback = "RIGHT";
        }else if(max === left){
            returnFeedback = "LEFT";
        }
    }else if(moveUp && moveDown && moveRight){
        var down: number = checkFieldBelow(positionOfHead, playField);
        var up: number = checkFieldAbove(positionOfHead, playField);
        var right: number = checkFieldRight(positionOfHead, playField);

        var max: number = Math.max(down, up, right);

        if(max === down){
            returnFeedback = "DOWN";
        }else if(max === up){
            returnFeedback = "UP";
        }else if(max === right){
            returnFeedback = "RIGHT";
        }
    }else if(moveUp && moveDown && moveLeft){
        var down: number = checkFieldBelow(positionOfHead, playField);
        var up: number = checkFieldAbove(positionOfHead, playField);
        var left: number = checkFieldLeft(positionOfHead, playField);

        var max: number = Math.max(down, up, left);

        if(max === down){
            returnFeedback = "DOWN";
        }else if(max === up){
            returnFeedback = "UP";
        }else if(max === left){
            returnFeedback = "LEFT";
        }
    }else if(moveUp && moveLeft && moveRight){
        var up: number = checkFieldAbove(positionOfHead, playField);
        var left: number = checkFieldLeft(positionOfHead, playField);
        var right: number = checkFieldRight(positionOfHead, playField);

        var max: number = Math.max(up, left, right);

        if(max === up){
            returnFeedback = "UP";
        }else if(max === left){
            returnFeedback = "LEFT";
        }else if(max === right){
            returnFeedback = "RIGHT";
        }
    }else if(moveDown && moveLeft && moveRight){
        var down: number = checkFieldBelow(positionOfHead, playField);
        var left: number = checkFieldLeft(positionOfHead, playField);
        var right: number = checkFieldRight(positionOfHead, playField);

        var max: number = Math.max(down, left, right);

        if(max === down){
            returnFeedback = "DOWN";
        }else if(max === left){
            returnFeedback = "LEFT";
        }else if(max === right){
            returnFeedback = "RIGHT";
        }
        
    }else if(moveUp && moveDown){
        var up: number = checkFieldAbove(positionOfHead, playField);
        var down: number = checkFieldBelow(positionOfHead, playField);

        if(up < down){
            returnFeedback = "UP";
        }else{
            returnFeedback = "DOWN";
        }
    }else if(moveLeft && moveRight){
        var left: number = checkFieldLeft(positionOfHead, playField);
        var right: number = checkFieldRight(positionOfHead, playField);

        if(left < right){
            returnFeedback = "LEFT";
        }else{
            returnFeedback = "RIGHT";
        }
    }else if(moveUp){
        returnFeedback = "UP";
    }else if(moveDown){
        returnFeedback = "DOWN";
    }else if(moveLeft){
        returnFeedback = "LEFT";
    }else if(moveRight){
        returnFeedback = "RIGHT"
    }

    return returnFeedback;
}

function checkFieldAbove(head: Coord, playField: fieldHorizontal[]): number{
    if(playField[head.x].fieldsAbove[head.y + 1].occupied){
        return -2000;
    }else{
        return playField[head.x].fieldsAbove[head.y + 1].score;
    }
}

function checkFieldBelow(head: Coord, playField: fieldHorizontal[]): number{
    if(playField[head.x].fieldsAbove[head.y - 1].occupied){
        return -2000;
    }else{
        return playField[head.x].fieldsAbove[head.y - 1].score;
    }
}

function checkFieldLeft(head: Coord, playField: fieldHorizontal[]): number{
    if(playField[head.x - 1].fieldsAbove[head.y].occupied){
        return -2000;
    }else{
        return playField[head.x - 1].fieldsAbove[head.y].score;
    }
}

function checkFieldRight(head: Coord, playField: fieldHorizontal[]): number{
    if(playField[head.x + 1].fieldsAbove[head.y].occupied){
        return -2000;
    }else{
        return playField[head.x + 1].fieldsAbove[head.y].score;
    }
}