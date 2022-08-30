export class testgiveBoolean{
    private testvalue: boolean;

    public constructor(testvalue: boolean){
        this.testvalue = testvalue;
    }

    public getTestvalue(): boolean{
        console.log("returning testvalue");
        return this.testvalue;
    }
}