import {Vector, column} from "./typesFor2dArr";
import {Coord} from "./types";

export class TwoDimensionalArray{
    private storage: column[];
    private width: number;
    private height: number;

    public constructor(width: number, height: number){
        this.width = width;
        this.height = height;
        this.storage = new Array();
        for(let indexForWidth = 0; indexForWidth < this.width; indexForWidth++){
            let rowsForOneColumn: Vector[] = new Array();
            for(let indexForHeight = 0; indexForHeight < this.height; indexForHeight++){
                let currentCoord: Coord = {x: indexForWidth, y: indexForHeight};
                let vektorToAdd: Vector = new Vector(currentCoord, false, 0, 0);
                rowsForOneColumn.push(vektorToAdd);
            }
            let oneCollum: column = {rows: rowsForOneColumn};
            this.storage.push(oneCollum);
        }
        //countinue working here .............
    }
}