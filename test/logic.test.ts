import { info, move } from '../src/logic'
import { Battlesnake, Coord, GameState, MoveResponse } from '../src/types';
import { Playfield } from '../src/Playfield';
import { TwoDimensionalArray } from '../src/TwoDimensionalArray';
import { column } from '../src/Interfaces';
import exp from 'constants';
import { Gridboard } from '../src/Gridboard';

function createGameState(me: Battlesnake): GameState {
    return {
        game: {
            id: "",
            ruleset: { 
                name: "",
                version: "",
                settings: {
                    foodSpawnChance: 0,
                    minimumFood: 0,
                    hazardDamagePerTurn: 0,
                    hazardMap: "",
                    hazardMapAuthor: "",
                    royale: {
                        shrinkEveryNTurns: 0
                    },
                    squad: {
                        allowBodyCollisions: true,
                        sharedElimination: false,
                        sharedHealth: false,
                        sharedLength: false
                    }
                } 
            },
            timeout: 0,
            source: ""
        },
        turn: 0,
        board: {
            height: 5,
            width: 5,
            food: [],
            snakes: [me],
            hazards: [{x:2, y: 4}, {x: 2, y: 3}, {x:1, y: 3}, {x:0, y: 3}]
        },
        you: me
    }
}

function createBattlesnake(): Battlesnake {
    return {
        id: "",
        name: "",
        health: 100,
        body: [{x:1, y:2}, {x: 0, y: 2}, {x:0, y: 1}, {x:0, y: 0}],
        latency: "",
        head: {x:1, y: 2},
        length: 4,
        customizations: {
            color: "#888888",
            head: "default",
            tail: "default"
        },
        shout: "",
        squad: ""
    }
}


/* describe('Battlesnake API Version', () => {
    it('should be api version 1', () => {
        const result = info()
        expect(result.apiversion).toBe("1")
    })
})

describe('Initializing playfield', () => {
    it('attributes should be {occupied: false, occupiedFor: undefined, distanceToOwnHead: undefined, neighbours: [key: above]: undefined}', () => {
        const testplayfield: Playfield = new Playfield(false);
        expect(testplayfield.isOccupied()).toBe(false);
        expect(testplayfield.isOccupiedFor()).toBe(undefined);
        expect(testplayfield.getDistanceToOwnHead()).toBe(undefined);
        expect(testplayfield.getNeighbours().above).toBe(undefined);
    })
})

describe('Initialzing TwoDimensionalArray', () => {
    it('initialzing a testarray with the attributes {width: 10, height: 10}', () => {
        const twoDimArray: TwoDimensionalArray = new TwoDimensionalArray(10, 10);
        expect(twoDimArray.isInRangeOfArray({x: 4, y: 5})).toBe(true);
        expect(twoDimArray.isInRangeOfArray({x: 30, y: 15})).toBe(false);
        expect(twoDimArray.getPlayField({x: 6, y: 6})?.isOccupied()).toBe(false);
    })
})

describe('TwoDimensionalArray overwriting playfield', () => {
    it('overwriting a field with a new playfield', () => {
        let twoDimArray: TwoDimensionalArray = new TwoDimensionalArray(10, 10);
        const newPlayfield: Playfield = new Playfield(true);
        expect(newPlayfield.isOccupied()).toBe(true);
        expect(twoDimArray.getPlayField({x: 3, y: 4})?.isOccupied()).toBe(false);
        twoDimArray.overwrite({x: 3, y: 4}, newPlayfield);
        expect(twoDimArray.getPlayField({x: 3, y: 4})?.isOccupied()).toBe(true);
    })
})

describe('TwoDimensionalArray getting Neighbours', () => {
    it('overwriting a field with a new playfield', () => {
        let twoDimArray: TwoDimensionalArray = new TwoDimensionalArray(10, 10);
        const newPlayfield: Playfield = new Playfield(true);
        expect(newPlayfield.isOccupied()).toBe(true);
        twoDimArray.overwrite({x: 3, y: 4}, newPlayfield);
        expect(twoDimArray.getPlayField({x: 3, y: 4})?.isOccupied()).toBe(true);
        expect(twoDimArray.getNeighbours({x: 3, y: 3})?.above?.isOccupied()).toBe(true);
        expect(twoDimArray.getNeighbours({x: 3, y: 3})?.left?.isOccupied()).toBe(false);
        expect(twoDimArray.getNeighbours({x: -3, y: 40})).toBe(undefined);
    })
})

describe('Declarating Coords', () => {
    it('checking the coords of playfields in array', () => {
        let twoDimArray: TwoDimensionalArray = new TwoDimensionalArray(10, 10);
        let playfield: Playfield | undefined = twoDimArray.getPlayField({x: 3, y: 5});
        expect(playfield?.getCoord()?.x).toBe(3);
        expect(playfield?.getCoord()?.y).toBe(5);
    })
})

describe('Setting Neighbours', () => {
    it('checking for the reight neighbour initialization', () => {
        let twoDimArray: TwoDimensionalArray = new TwoDimensionalArray(10, 10);
        let playfield: Playfield | undefined = twoDimArray.getPlayField({x: 3, y: 5});
        playfield?.setNeighbour("above", twoDimArray.getNeighbours({x: 3, y: 5})?.above);
        expect(playfield?.getNeighbours()?.above?.getCoord()?.y).toBe(6);
        let doubleNeighbour: Playfield | undefined = twoDimArray.getPlayField({x: 3, y: 6});
        let neighbourAboveDouble: Playfield | undefined = twoDimArray.getNeighbours({x: 3, y: 6})?.above;
        doubleNeighbour?.setNeighbour("above", neighbourAboveDouble);
        playfield?.setNeighbour("above", doubleNeighbour);
        expect(playfield?.getNeighbours().above?.getNeighbours().above?.getCoord()?.y).toBe(7);
    })
})

describe('Grid Coords', () => {
    it('checking for Playfields in Grid are on the right pos.', () => {
        let playboard: Gridboard = new Gridboard(createGameState(createBattlesnake()));
        console.log("sucessfully generated playboard!");
        expect(playboard.playboard.getPlayField({x:1, y:1})?.isOccupied()).toBe(true);
        expect(playboard.playboard.getPlayField({x:1, y:4})?.isOccupied()).toBe(true);
        expect(playboard.playboard.getPlayField({x:2, y:4})?.isOccupiedFor()).toBe(2);
        expect(playboard.playboard.getPlayField({x:2, y:4})?.getDistanceToOwnHead()).toBe(2);
        
    })
})

describe('Grid Coords', () => {
    it('checking for Playfields in Grid are on the right pos.', () => {
        let playboard: Gridboard = new Gridboard(createGameState(createBattlesnake()));
        console.log("sucessfully generated playboard!");
        expect(playboard.playboard.getPlayField({x:1, y:1})?.isOccupied()).toBe(true);
        expect(playboard.playboard.getPlayField({x:1, y:4})?.isOccupied()).toBe(true);
        expect(playboard.playboard.getPlayField({x:2, y:4})?.isOccupiedFor()).toBe(2);
        expect(playboard.playboard.getPlayField({x:2, y:4})?.getDistanceToOwnHead()).toBe(2);
        
    })
}) */

/* describe('countung free fields', () => {
    it('checking for reachable fields.', () => {
        let playboard: Gridboard = new Gridboard(createGameState(createBattlesnake()));
        let counterForLeft = playboard.countFreeFields({x: 0, y: 4}, 0);
        playboard.playboard.setForAllFieldsVisited(false);
        let counterForRight = playboard.countFreeFields({x: 2, y: 4}, 0);
        console.log(counterForLeft);
        console.log(counterForRight);
    })
}) */

describe('loop Methode', () => {
    it('checking for reachable fields.', () => {
        let playboard: Gridboard = new Gridboard(createGameState(createBattlesnake()));
        /* let priorityMoves = playboard.nextStepForLoop(); */
    })
})
