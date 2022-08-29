import {Coord, InfoResponse, GameState, MoveResponse, Game, Battlesnake } from "./types"

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

    //initialize playBoard
    //fill playBoard
    //upgrade playBoardInformation (with Movement prediction)
    //calculateNextMove

    var playBoard = initPlayBoard(gameState);

    playBoard = upgradePlayBoardInformation(gameState, playBoard);

    printPlayBoard(playBoard);

    var counter:number = 2;
    while(counter > 0){
        playBoard = prepareArrayForFlatting(playBoard);
        counter--;
    }
    
    printPlayBoard(playBoard);

    var movementDirection: string = calculateNextMove(gameState, playBoard);

    switch(movementDirection){
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
            possibleMoves.up = false;
            possibleMoves.down = false;
            possibleMoves.right = false;
            break;
        case "right":
            possibleMoves.up = false;
            possibleMoves.down = false;
            possibleMoves.left = false;
            break;
    }

    const safeMoves = Object.keys(possibleMoves).filter(key => possibleMoves[key])
    const response: MoveResponse = {
        move: safeMoves[Math.floor(Math.random() * safeMoves.length)],
    }

    console.log(`${gameState.game.id} MOVE ${gameState.turn}: ${response.move}`)
    return response
}

//class playBoard
class PlayBoard{
    private width: number;
    private height: number;
    private playBoard: fieldHolder[];

    public constructor(widthOfPlayBoard: number, heightOfPlayBoard: number){
        //initialize a 2d-Array with no Fields occupied and a score of 0 for all Fields
        console.log("creating current playboard:");
        this.width = widthOfPlayBoard;
        console.log("width of playboard is: " + this.width);
        this.height = heightOfPlayBoard;
        console.log("height of playboard is: " + this.height);
        this.playBoard = new Array();
        for(var indexForWidth = 0; indexForWidth < this.width; indexForWidth++){
            console.log("playboard-filling-interation " + indexForWidth + " has been started:")
            console.log("index for width: " + indexForWidth + ":");
            var currentFieldHolder: fieldHolder;
            var verticalFieldsForOneHolder: playField[] = new Array();
            for(var indexForHeight = 0; indexForHeight < this.height; indexForHeight++){
                var currentPlayField: playField = {occupied: false, score: 0};
                console.log("index for heigth: " + indexForHeight);
                verticalFieldsForOneHolder.push(currentPlayField);
                console.log("play with parameters occupied=false and score=0 has been added to playboard!");
            }
            currentFieldHolder = {verticalFields: verticalFieldsForOneHolder};
            this.playBoard.push(currentFieldHolder);
            console.log("current iteration has been finished!");
        }
    }

    public getFieldAtCoord(coord: Coord): playField{
        var xCoord: number = coord.x;
        var yCoord: number = coord.y;
        var returnFeedback: playField;
        if(xCoord < this.width && xCoord >= 0 && yCoord < this.height && yCoord >= 0){

            returnFeedback = this.playBoard[xCoord].verticalFields[yCoord];

        }else{

            returnFeedback = {occupied: true, score: 0};

        }
        return returnFeedback;
    }

    public overwriteFieldAtCoord(coord: Coord, newPlayField: playField): void{
        var xCoord: number = coord.x;
        var yCoord: number = coord.y;
        console.log("!!!!! methode /overwriteFieldAtCoord/ has been started:");
        console.log("field to overwrite is at: x: " + xCoord + ", y: " + yCoord);
        console.log("content of new playfield is: ");
        if(newPlayField.occupied){

            console.log("occupied: true");
                
        }else{

             console.log("occupied: false");

        }
        console.log("score: " + newPlayField.score);
        if(xCoord < this.width && yCoord < this.height){
            this.playBoard[xCoord].verticalFields[yCoord].occupied = newPlayField.occupied;
            this.playBoard[xCoord].verticalFields[yCoord].score = newPlayField.score;
            console.log("feld has been overwritten sucessfully!");
        }else{
            console.log("searched field is not in range of playboard!");
        }
    }

    public isWorkingCorrectly(gameState: GameState): boolean{
        console.log("!!!!! methode /isWorkingCorrectly/ has been started:");
        var correctSize: boolean;
        console.log("checking size of playboard:");
        console.log("have to be: ");
        console.log("width: " + (gameState.board.width - 1) + ", height: " + (gameState.board.height - 1));
        var counterCheck: number = -1;
        for(var counter: number = 0; counter < this.playBoard.length; counter++){
            console.log("width counter(index form): " + counter);
            counterCheck = counter;
        }
        if((gameState.board.width - 1) === counterCheck){
            console.log("size of playboard is correct!");
            correctSize = true;
        }else{
            console.log("size of playboard is not correct!");
            correctSize = false;
        }
        //Implement other Tests here...
        return correctSize;
    }

    public getHeight(): number{
        return this.height;
    }

    public getWidth(): number{
        return this.width;
    }

    /**
     * 
     * @returns an array with the field above at index 0, the field below at index 1, the left field at index 2 and the right field at index 3. 
     * 
     * @specialCases if the field isn't reachable the occupied value of the returned field will be true and the score will be 0.
     */
    public getFieldsAround(coord: Coord): playField[]{
        console.log("!!!!! methode /getFieldsAround/ has been started:");
        var returnFields: playField[] = new Array();
        var aboveReachable: boolean = true;
        var belowReachable: boolean = true;
        var leftReachable: boolean = true;
        var rightReachable: boolean = true;

        if(coord.x < 1){
            console.log("left field from " + coord.x + "|" + coord.y + " is not reachable!");
            leftReachable = false;
        }else if(coord.x > (this.width - 1)){
            console.log("left right from " + coord.x + "|" + coord.y + " is not reachable!");
            rightReachable = false;
        }
        if(coord.y < 1){
            console.log("field below from " + coord.x + "|" + coord.y + " is not reachable!");
            belowReachable = false;
        }else if(coord.y > (this.height - 1)){
            console.log("field above from " + coord.x + "|" + coord.y + " is not reachable!");
            aboveReachable = false; 
        }

        if(aboveReachable){
            var coordOfFieldAbove: Coord = {x: coord.x, y: coord.y + 1};
            returnFields.push(this.getFieldAtCoord(coordOfFieldAbove));
        }else if(!aboveReachable){
            var emptyField: playField = {occupied: true, score: 0};
            returnFields.push(emptyField);
        }
        if(belowReachable){
            var coordOfFieldAbove: Coord = {x: coord.x, y: coord.y - 1};
            returnFields.push(this.getFieldAtCoord(coordOfFieldAbove));
        }else if(!belowReachable){
            var emptyField: playField = {occupied: true, score: 0};
            returnFields.push(emptyField);
        }
        if(leftReachable){
            var coordOfFieldAbove: Coord = {x: coord.x - 1, y: coord.y};
            returnFields.push(this.getFieldAtCoord(coordOfFieldAbove));
        }else if(!leftReachable){
            var emptyField: playField = {occupied: true, score: 0};
            returnFields.push(emptyField);
        }
        if(rightReachable){
            var coordOfFieldAbove: Coord = {x: coord.x + 1, y: coord.y};
            returnFields.push(this.getFieldAtCoord(coordOfFieldAbove));
        }else if(!rightReachable){
            var emptyField: playField = {occupied: true, score: 0};
            returnFields.push(emptyField);
        }

        return returnFields;
    }

    /**
     * 
     * 
     * @returns an array including the information which direct neighbour is reachable with the field above at index 0, the field below at index 1, the field left at index 2 and the field right at index 3.
     */
    public fieldsAroundReachable(coord: Coord): boolean[]{
        var fieldsReachable: boolean[] = new Array();
        var aboveReachable: boolean = true;
        var belowReachable: boolean = true;
        var leftReachable: boolean = true;
        var rightReachable: boolean = true;

        var coordOfLeftField: Coord = {x: coord.x - 1, y: coord.y};
        if(coord.x < 1 || this.getFieldAtCoord(coordOfLeftField).occupied){
            console.log("left field from " + coord.x + "|" + coord.y + " is not reachable!");
            leftReachable = false;
        }
        var coordOfRightField: Coord = {x: coord.x + 1, y: coord.y};
        if(coord.x > (this.width - 1) ||this.getFieldAtCoord(coordOfRightField).occupied){
            console.log("left right from " + coord.x + "|" + coord.y + " is not reachable!");
            rightReachable = false;
        }
        var coordOfBelowField: Coord = {x: coord.x, y: coord.y - 1};
        if(coord.y < 1 || this.getFieldAtCoord(coordOfBelowField).occupied){
            console.log("field below from " + coord.x + "|" + coord.y + " is not reachable!");
            belowReachable = false;
        }
        var coordOfAboveField: Coord = {x: coord.x, y: coord.y + 1};
        if(coord.y > (this.height - 1) ||this.getFieldAtCoord(coordOfAboveField).occupied){
            console.log("field above from " + coord.x + "|" + coord.y + " is not reachable!");
            aboveReachable = false; 
        }
        fieldsReachable.push(aboveReachable);
        fieldsReachable.push(belowReachable);
        fieldsReachable.push(leftReachable);
        fieldsReachable.push(rightReachable);

        return fieldsReachable;
    }
}

//Interface fieldHolder
interface fieldHolder{
    verticalFields: playField[];
}

//Interface playField
interface playField{
    occupied: boolean;
    score: number;
}

//Interface snakeBody
interface snakeBody{
    position: Coord;
    timeToReach: number;
}

//Methode calculate Distance between Coords
function calculateDistanceBetweenCoords(pos1: Coord, pos2: Coord): number{
    var returnValue: number;
    var xDifference: number;
    var yDifference: number;

    xDifference = Math.abs(pos1.x - pos2.x);
    yDifference = Math.abs(pos1.y - pos2.y);

    returnValue = xDifference + yDifference;

    return returnValue;
}

//Methode print playBoard
function printPlayBoard(playBoardToPrint: PlayBoard){
    console.log("!!!!! printing playboard....");
    var verticalField: string = "| ";
    console.log("legend for playboard: \n o: occupied \n f: free \n '[number]': score of Field");
    console.log("\n \n");
    for(var indexForHeight: number = playBoardToPrint.getHeight(); indexForHeight > -1; indexForHeight--){
        for(var indexForWidth: number = 0; indexForWidth < playBoardToPrint.getWidth(); indexForWidth++){
            var currentCoord: Coord = {x: indexForWidth, y: indexForHeight};
            if(playBoardToPrint.getFieldAtCoord(currentCoord).occupied){
                verticalField += "o";
            }else{
                verticalField += "f";
            }
            verticalField += "[";
            verticalField += String(playBoardToPrint.getFieldAtCoord(currentCoord).score);
            verticalField += "]";
            verticalField += " | ";
        }
        verticalField += "\n| ";
    }
    console.log(verticalField)
}

//Methode initialize playBoard
function initPlayBoard(gameState: GameState): PlayBoard{
    console.log("!!!!! methode /initPlayBoard/ has been started:");
    var widthOfPlayBoard: number = gameState.board.width;
    var heightOfPlayBoard: number = gameState.board.height;
    console.log("size of playboard has been synced!");
    var returnBoard: PlayBoard = new PlayBoard(widthOfPlayBoard, heightOfPlayBoard);
    console.log("starting final check:")
    if(returnBoard.isWorkingCorrectly(gameState)){
        console.log("Everything is working coorectly!");
        return returnBoard;
    }else{
        console.log("an error has been found! returning empty playboard!");
        return new PlayBoard(0, 0);
    }
}
//Methode predictSnakeMovement

//Methode upgradePlayBoardInformation
function upgradePlayBoardInformation(gameState: GameState, playBoardToUpgrade: PlayBoard): PlayBoard{
    console.log("!!!!! methode /upgradePlayBoardInformation/ has been started:");
    var returnPlayBoard: PlayBoard = playBoardToUpgrade;
    var hazardWalls: Coord[] = gameState.board.hazards;
    var food: Coord[] = gameState.board.food;
    var snakes: Battlesnake[] = gameState.board.snakes;
    var coordsOfOwnHead: Coord = gameState.you.head;
    
    //occupying hazardwalls:
    for(var indexForHazardArray: number = 0; indexForHazardArray < hazardWalls.length; indexForHazardArray++){
        var coordOfCurrentWall: Coord = hazardWalls[indexForHazardArray];
        console.log("found hazardwall at: " +"x: " + coordOfCurrentWall.x, + " y: " + coordOfCurrentWall.y);
        var newPlayField: playField = {occupied: true, score: 0};
        returnPlayBoard.overwriteFieldAtCoord(coordOfCurrentWall, newPlayField);
    }

    //enter request for foodMode here...
    var lastRating: number = 0;
    var currentRating: number = food.length * 100000;
    console.log("start rating for food is: " + currentRating)
    var lastDistanceToFood: number = 0;
    var currentDistanceToFood: number = 0;
    
    //rating food field:
    for(var indexForFoodArray: number = 0; indexForFoodArray < food.length; indexForFoodArray++){
        var coordOfCurrentFood: Coord = food[indexForFoodArray];
        console.log("found food at: " +"x: " + coordOfCurrentFood.x, + " y: " + coordOfCurrentFood.y);
        var coordOfOwnHead: Coord = gameState.you.head;
        currentDistanceToFood = calculateDistanceBetweenCoords(coordOfCurrentFood, coordOfOwnHead);
        console.log("distance to currentFoodCoords: " + currentDistanceToFood);
        if(lastDistanceToFood === 0){

            console.log("food rating: " + currentRating);
            var newField: playField = {occupied: false, score: currentRating};
            playBoardToUpgrade.overwriteFieldAtCoord(coordOfCurrentFood, newField);
            lastRating = currentRating;
            lastDistanceToFood = currentDistanceToFood;

        }else if(lastDistanceToFood > currentDistanceToFood){

            console.log("current food is better to reach then last one!")
            currentRating = lastRating + 100000;
            console.log("food rating: " + currentRating);
            var newField: playField = {occupied: false, score: currentRating}
            playBoardToUpgrade.overwriteFieldAtCoord(coordOfCurrentFood, newField);
            lastDistanceToFood = currentDistanceToFood;
            lastRating = currentRating;

        }else if(lastDistanceToFood < currentDistanceToFood){

            console.log("current food is not better to reach then last one!")
            currentRating = lastRating - 100000;
            console.log("food rating: " + currentRating);
            var newField: playField = {occupied: false, score: currentRating}
            playBoardToUpgrade.overwriteFieldAtCoord(coordOfCurrentFood, newField);
            lastDistanceToFood = currentDistanceToFood;
            lastRating = currentRating;

        }else if(lastDistanceToFood === currentDistanceToFood){

            console.log("the distance between last and current food is the same!");
            currentRating = lastRating;
            var newField: playField = {occupied: false, score: currentRating}
            playBoardToUpgrade.overwriteFieldAtCoord(coordOfCurrentFood, newField);
            console.log("food rating: " + currentRating);

        }
    }

    //occupying and rating fields with other snakes:
    for(var indexForSnakeArray: number = 0; indexForSnakeArray < snakes.length; indexForSnakeArray++){
        for(var indexForSnakeBody: number = 0; indexForSnakeBody < snakes[indexForSnakeArray].body.length; indexForSnakeBody++){
            if(JSON.stringify(snakes[indexForSnakeArray].body[indexForSnakeBody]) === JSON.stringify(coordsOfOwnHead)){
                if(snakes[indexForSnakeArray].body.length > 3 && indexForSnakeBody === 0){
                    indexForSnakeBody += 3;
                    console.log("3 Parts of own snakebody has been skiped!");
                }else{
                    console.log("own snakebody has been skiped completely!");
                    break;
                }
            }else{
                console.log("found part of snakebody!");
                var snakeField: playField = {occupied: false, score: -50000};
                var coordOfSnakeBodyPart: Coord = snakes[indexForSnakeArray].body[indexForSnakeBody];
                playBoardToUpgrade.overwriteFieldAtCoord(coordOfSnakeBodyPart, snakeField);
            }
        }
    }

    return returnPlayBoard;

}

//Metode prepare Array for flatting
function prepareArrayForFlatting(playBoardToPrepare: PlayBoard): PlayBoard{
    for(var indexForHeight = 0; indexForHeight < playBoardToPrepare.getHeight(); indexForHeight++){
        for(var indexForWidth = 0; indexForWidth < playBoardToPrepare.getWidth(); indexForWidth ++){
            var currentCoord: Coord = {x: indexForWidth, y: indexForHeight};
            var averageScore: number = playBoardToPrepare.getFieldAtCoord(currentCoord).score;
            var fieldsAroundCounter = 1;
            var playFieldsAround: playField[] = playBoardToPrepare.getFieldsAround(currentCoord);
            for(var indexForFieldsAround = 0; indexForFieldsAround < playFieldsAround.length; indexForFieldsAround++){
                if(playFieldsAround[indexForFieldsAround].score != 0){
                    averageScore += playFieldsAround[indexForFieldsAround].score;
                    fieldsAroundCounter++;
                }    
            }
            var playFieldWithNewScore: playField = {occupied: playBoardToPrepare.getFieldAtCoord(currentCoord).occupied, score: averageScore / fieldsAroundCounter};
            playBoardToPrepare.overwriteFieldAtCoord(currentCoord, playFieldWithNewScore);
        }
    }
    return playBoardToPrepare;
}

//Methode flatScoresOnPlayBoard
//function flatPlayBoardStatics(playBoardToFlat: PlayBoard): PlayBoard{
    //continue working here !!!!!!!!!!!!!!!!!!!!!!
//}

//Methode calculateNextMove
function calculateNextMove(gameState: GameState, playBoard: PlayBoard): string{
    console.log("!!!Methode /calNextMove/ has been started")
    var posOfHead: Coord = gameState.you.head;
    var possibleMoves: boolean[] = playBoard.fieldsAroundReachable(posOfHead);

    //logic not to run into own body
    if(posOfHead.y > gameState.you.body[1].y){
        possibleMoves[1] = false;
        console.log("neck is below head!")
    }else if(posOfHead.y < gameState.you.body[1].y){
        possibleMoves[0] = false;
        console.log("neck is above head!")
    }else if(posOfHead.x < gameState.you.body[1].x){
        possibleMoves[3] = false;
        console.log("neck is left from head!")
    }else if(posOfHead.x > gameState.you.body[1].x){
        possibleMoves[2] = false;
        console.log("neck is right from head!")
    }


    var fieldsAroundCurrentCoord: playField[] = playBoard.getFieldsAround(posOfHead);
    var neighboursSortedByScore: playField[] = sortArrayByScore(fieldsAroundCurrentCoord);

    var returnStatement: string = "";

    if(possibleMoves[0] && possibleMoves[1] && possibleMoves[2] && possibleMoves[3]){
        console.log("all directions are available!");
        //all directions:
        for(var index = 0; index < neighboursSortedByScore.length; index++){
            if(neighboursSortedByScore[index].score === fieldsAroundCurrentCoord[0].score){
                returnStatement = "up";
                break;
            }else if(neighboursSortedByScore[index].score === fieldsAroundCurrentCoord[1].score){
                returnStatement = "down";
                break;
            }else if(neighboursSortedByScore[index].score === fieldsAroundCurrentCoord[2].score){
                returnStatement = "left";
                break;
            }else if(neighboursSortedByScore[index].score === fieldsAroundCurrentCoord[3].score){
                returnStatement = "right";
                break;
            }
        }
    }else if(possibleMoves[0] && possibleMoves[2] && possibleMoves[3]){
        //up, left and right:
        console.log("it's possible to move up, left and right!");
        for(var index = 0; index < neighboursSortedByScore.length; index++){
            if(neighboursSortedByScore[index].score === fieldsAroundCurrentCoord[0].score){
                returnStatement = "up";
                break;
            }else if(neighboursSortedByScore[index].score === fieldsAroundCurrentCoord[2].score){
                returnStatement = "left";
                break;
            }else if(neighboursSortedByScore[index].score === fieldsAroundCurrentCoord[3].score){
                returnStatement = "right";
                break;
            }
        }
    }else if(possibleMoves[1] && possibleMoves[2] && possibleMoves[3]){
        console.log("it's possible to move down, left and right!");
        //down, left and right:
        for(var index = 0; index < neighboursSortedByScore.length; index++){
            if(neighboursSortedByScore[index].score === fieldsAroundCurrentCoord[1].score){
                returnStatement = "down";
                break;
            }else if(neighboursSortedByScore[index].score === fieldsAroundCurrentCoord[2].score){
                returnStatement = "left";
                break;
            }else if(neighboursSortedByScore[index].score === fieldsAroundCurrentCoord[3].score){
                returnStatement = "right";
                break;
            }
        }
    }else if(possibleMoves[0] && possibleMoves[1] && possibleMoves[3]){
        console.log("it's possible to move up, down and right!");
        //up, down and right:
        for(var index = 0; index < neighboursSortedByScore.length; index++){
            if(neighboursSortedByScore[index].score === fieldsAroundCurrentCoord[0].score){
                returnStatement = "up";
                break;
            }else if(neighboursSortedByScore[index].score === fieldsAroundCurrentCoord[1].score){
                returnStatement = "down";
                break;
            }else if(neighboursSortedByScore[index].score === fieldsAroundCurrentCoord[3].score){
                returnStatement = "right";
                break;
            }
        }
    }else if(possibleMoves[0] && possibleMoves[1] && possibleMoves[2]){
        //up, down and left:
        console.log("it's possible to move up, left and left!");
        for(var index = 0; index < neighboursSortedByScore.length; index++){
            if(neighboursSortedByScore[index].score === fieldsAroundCurrentCoord[0].score){
                returnStatement = "up";
                break;
            }else if(neighboursSortedByScore[index].score === fieldsAroundCurrentCoord[1].score){
                returnStatement = "down";
                break;
            }else if(neighboursSortedByScore[index].score === fieldsAroundCurrentCoord[2].score){
                returnStatement = "left";
                break;
            }
        }
    }else if(possibleMoves[0] && possibleMoves[1]){
        console.log("it's possible to move up and down!");
        //up and down:
        if(fieldsAroundCurrentCoord[0].score < fieldsAroundCurrentCoord[1].score){
            returnStatement = "up"
        }else{
            returnStatement = "down"
        }
    }else if(possibleMoves[2] && possibleMoves[3]){
        console.log("it's possible to left up and right!");
        //left and right:
        if(fieldsAroundCurrentCoord[2].score < fieldsAroundCurrentCoord[3].score){
            returnStatement = "right";
        }else{
            returnStatement = "left";
        }
    }else if(possibleMoves[0]){
        console.log("it's possible to move up!");
        //up:
        returnStatement = "up";
    }else if(possibleMoves[1]){
        console.log("it's possible to move down!");
        //down:
        returnStatement = "down";
    }else if(possibleMoves[2]){
        console.log("it's possible to move left!");
        //left:
        returnStatement = "left";
    }else if(possibleMoves[3]){
        console.log("it's possible to move right!");
        //right:
        returnStatement = "right";
    }

    return returnStatement;
}

//Methode findFieldWithBiggestScoreInArray
function sortArrayByScore(arrayToAnalyze: playField[]): playField[]{
    console.log("start sorting neighbour array!")
    var changedSomething = true;
    while(changedSomething){
        changedSomething = false;
        for(var index = 0; index < arrayToAnalyze.length - 1; index++){
            if(arrayToAnalyze[index].score < arrayToAnalyze[index + 1].score){
                var tmpPlayField: playField = arrayToAnalyze[index];
                arrayToAnalyze[index] = arrayToAnalyze[index + 1];
                arrayToAnalyze[index + 1] = tmpPlayField;
                changedSomething = true;
            }
        }
    }
    console.log("biggest score is: " + arrayToAnalyze[0].score);
    return arrayToAnalyze;
}

//watch for: cleanCode, feed protocol

