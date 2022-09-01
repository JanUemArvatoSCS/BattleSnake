import { info, move } from '../src/logic'
import { Battlesnake, Coord, GameState, MoveResponse } from '../src/types';
import { Playfield } from '../src/Playfield';
import { TwoDimensionalArray } from '../src/TwoDimensionalArray';
import { column } from '../src/Interfaces';
import exp from 'constants';

describe('Battlesnake API Version', () => {
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

describe('Generating Grid', () => {
    it('generating a playfield with all of its reachable fields', () => {
        const twoDimArray: TwoDimensionalArray = new TwoDimensionalArray(5, 5);
        let newPlayfield: Playfield = new Playfield(false);
        newPlayfield.setDistanceToOwnHead(3);
        twoDimArray.overwrite({x: 4, y: 0}, newPlayfield);
        let playFieldWithGrid = twoDimArray.generateGrid({x: 4, y: 3});
        expect(playFieldWithGrid?.getNeighbours().below?.getNeighbours().below?.getNeighbours().below?.getDistanceToOwnHead()).toBe(3);
        expect(twoDimArray.generateGrid({x:9, y: 34})).toBe(undefined);
    })
})

