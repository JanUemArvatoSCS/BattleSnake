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

    //initialize playBoard
    //fill playBoard
    //upgrade playBoardInformation (with Movement prediction)
    //calculateNextMove

    var playBoard = initPlayBoard(gameState);

    printPlayBoard(playBoard);

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
            console.log("current iteration has been finished!")
        }
    }

    public getFieldAtCoord(coord: Coord): playField{
        var xCoord: number = coord.x;
        var yCoord: number = coord.y;
        var returnFeedback: playField;
        console.log("!!!!! methode /getFieldAtCoords/ has been started:");
        console.log("searched field is at: x: " + xCoord + ", y: " + yCoord);
        if(xCoord < this.width && yCoord < this.height){

            console.log("Coords in range of playboard!");
            returnFeedback = this.playBoard[xCoord].verticalFields[yCoord];
            console.log("found searched field!");
            console.log("content of field is: ");

            if(returnFeedback.occupied){

                console.log("occupied: true");
                
            }else{

                console.log("occupied: false");

            }
            console.log("score: " + returnFeedback.score);
        }else{

            returnFeedback = {occupied: false, score: 0};
            console.log("searched field is not in range of playboard!");

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
    
    for(var indexForHazardArray: number = 0; indexForHazardArray < hazardWalls.length; indexForHazardArray++){
        var coordOfCurrentWall: Coord = hazardWalls[indexForHazardArray];
        console.log("found hazardwall at: " +"x: " + coordOfCurrentWall.x, + " y: " + coordOfCurrentWall.y);
        var newPlayField: playField = {occupied: true, score: 0};
        returnPlayBoard.overwriteFieldAtCoord(coordOfCurrentWall, newPlayField);
    }

    //enter request for foodMode here...
    var lastRating: number = 0;
    var currentRating: number = food.length * 1000;
    var lastDistanceToFood: number = 0;
    var currentDistanceToFood: number = 0;
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
            currentRating = lastRating + 1000;
            console.log("food rating: " + currentRating);
            var newField: playField = {occupied: false, score: currentRating}
            lastDistanceToFood = currentDistanceToFood;
            lastRating = currentRating;

        }else if(lastDistanceToFood < currentDistanceToFood){

            console.log("current food is not better to reach then last one!")
            currentRating = lastRating - 1000;
            console.log("food rating: " + currentRating);
            var newField: playField = {occupied: false, score: currentRating}
            lastDistanceToFood = currentDistanceToFood;
            lastRating = currentRating;

        }else if(lastDistanceToFood === currentDistanceToFood){

            console.log("the distance between last and current food is the same!");
            currentRating = lastRating;
            console.log("food rating: " + currentRating);
            
        }
    }

}

//Methode flatScoresOnPlayBoard

//Methode calculateNextMove

//watch for: cleanCode, feed protocol

