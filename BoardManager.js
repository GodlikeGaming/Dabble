class BoardManager {
    constructor(g) {
        this.g = g;
        
        this.boardWidth = 9;
        this.boardHeight = 9;
        // configure tile width and height
        var factor = 0.5
        this.tileWidth = factor* window.width / this.boardWidth ;
        this.tileHeight = factor*window.height / this.boardHeight;
        var offset = (1 - factor)/2 * window.width

        this.boardTileList = []
        this.boardTileColor = '#A1CDA8'

        for (let x = 0; x < this.boardWidth; x++) {
            for (let y = 0; y < this.boardHeight; y++) {
                this.boardTileList.push(new BoardTile(x,y,offset + x*this.tileWidth,50+y*this.tileHeight));
            }
        }

        this.handTileList = []

        var handTileOffset = (this.tileWidth * this.boardWidth)/7;
        for (let i = 0; i < 7; i++) {
            this.handTileList.push(new Tile(i*handTileOffset+offset,(factor + 0.075)*window.height));
        }
    }
    GetBoardSquares() {
        return this.boardTileList;
    }
    GetHandPieces() {
        return this.handTileList.map(th => th.piece).filter(t => t !== null);
    }
    AddPieceToHand(piece) {
        this.handTileList.filter(x => x.piece === null)[0].AddPiece(piece);
    }
    GetSquares(){
        return this.boardTileList;
    }
    PlacePiecesInHand(pieces){
        pieces.forEach(t => {
            if (t.currentTile !== null) 
            {
                t.currentTile.ClearTile();
            }
            this.handTileList.filter(x => x.piece === null)[0].AddPiece(t)
        })
    }

    isPointInsideTile(x, y){
        return this.boardTileList.concat(this.handTileList).filter(d => 
            x >= d.x- this.tileWidth / 2 && 
            x <= d.x+ this.tileWidth / 2 &&
            y >= d.y- this.tileHeight / 2 && 
            y <= d.y+ this.tileHeight / 2
            )[0];
    }

    colorInvalidMove(tilestocolor){
        this.boardTileRects 
            .filter(d => tilestocolor.some(t => t.id === d.id))
            .transition()
            .duration(200)
            .attr('fill','red')
            .transition()
            .duration(500)
            .attr('fill',this.boardTileColor)
    }  


    draw(){
        var g = this.g;


        var boardTileList = this.boardTileList;
        boardTileList.forEach((d,i) => d.id = i);

        var percentage = window.percentage
        
        this.boardTileRects = g
           .selectAll('.square')
           .data(boardTileList, d => d.id)
           .join(
               enter => enter
                   .append('rect')
                   .attr('class', 'square')
                   .attr('x', d => d.x)//`${(100-percentage - percentage/this.boardWidth)/2 + (percentage*(d.boardX/(this.boardWidth-1)))}%`)
                   .attr('y', d => d.y)//`${5+percentage*(d.boardY/(this.boardHeight-1))}%`)
                   .attr('width', this.tileWidth)//`${percentage/this.boardWidth}%`)
                   .attr('height', this.tileHeight)
                   .attr('fill', this.boardTileColor)
                   .style('stroke-width', 2)
                   .style('stroke', 'black')
                   .on('click', (d) => window.gameManager.ClickTile(d)),
                   
           )

    }
}

class Tile {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.piece = null;
    }
    AddPiece(piece) {
        this.piece = piece;
        piece.x = this.x;
        piece.y = this.y;
        piece.currentTile = this;
    }
    ClearTile() {
        if (this.piece !== null) this.piece.currentTile = null;
        this.piece = null;
    }
}

class BoardTile extends Tile {
    constructor(boardX, boardY, x,y) {
        super(x,y)
        this.boardX = boardX;
        this.boardY = boardY;
    }
}