import { Playfield } from "./Playfield";

export interface column{
    rows: Playfield[];
}

export interface priorityMove{
    available: boolean;
    priority: number;
}