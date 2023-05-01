export class AlreadyCheckedInToday extends Error {
    constructor() {
        super("You already checked in today");
        this.name = "AlreadyCheckedInToday";
    }
}