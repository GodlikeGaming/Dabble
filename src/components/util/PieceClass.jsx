export class PieceClass {
    constructor(x, y, letter) {
        this.x = x;
        this.y = y;
        this.onBoard = false;
        this.letter= letter ? letter : "A";
        this.point=2;
    }
}