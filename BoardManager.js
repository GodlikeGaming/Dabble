class BoardManager {
    constructor(g) {
        this.g = g;
        this.tileWidth = 110;
        this.tileHeight = 110;

        this.boardWidth = 7;
        this.boardHeight = 6;
        this.square_list = []

        for (let x = 0; x < this.boardWidth; x++) {
            for (let y = 0; y < this.boardHeight; y++) {
                this.square_list.push(new Square(x,y,x*this.tileWidth,y*this.tileHeight));
            }
        }

        this.handList = []

        for (let i = 0; i < 7; i++) {
            this.handList.push(new TileHolder(i*this.tileWidth,700));
        }
    }
    GetBoardSquares() {
        return this.square_list;
    }
    GetHandTiles() {
        return this.handList.map(th => th.tile).filter(t => t !== null);
    }
    AddTileToHand(tile) {
        this.handList.filter(x => x.tile === null)[0].AddTile(tile);
    }
    GetSquares(){
        return this.square_list;
    }
    PlaceTilesInHand(tiles){
        console.log(tiles)
        tiles.forEach(t => {
            if (t.currentSquare !== null) 
            {
                t.currentSquare.ClearTile();
            }
            this.handList.filter(x => x.tile === null)[0].AddTile(t)
        })
    }

    isPointInsideSquare(x, y){
        return this.square_list.concat(this.handList).filter(d => 
            x >= d.x- this.tileWidth / 2 && 
            x <= d.x+ this.tileWidth / 2 &&
            y >= d.y- this.tileHeight / 2 && 
            y <= d.y+ this.tileHeight / 2
            )[0];
    }

    draw(){
        var g = this.g;


        var squareList = this.square_list;
        squareList.forEach((d,i) => d.id = i);

       
        
        this.squares = g
           .selectAll('.square')
           .data(squareList, d => d.id)
           .join(
               enter => enter
                   .append('rect')
                   .attr('class', 'square')
                   .attr('x', d => d.x)
                   .attr('y', d => d.y)
                   .attr('width', '11%')
                   .attr('height', '11%')
                   .attr('fill', 'green')
                   .style('stroke-width', 2)
                   .style('stroke', 'black')
                   .on('click', (d) => window.gameManager.ClickSquare(d)),
                   
           )

    }
}

class TileHolder {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.tile = null;
    }
    AddTile(tile) {
        this.tile = tile;
        tile.x = this.x+5;
        tile.y = this.y+5;
        tile.currentSquare = this;
    }
    ClearTile() {
        this.tile.currentSquare = null;
        this.tile = null;
    }
}

class Square extends TileHolder {
    constructor(boardX, boardY, x,y) {
        super(x,y)
        this.boardX = boardX;
        this.boardY = boardY;
    }
}