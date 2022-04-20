class BoardManager {
    constructor(g) {
        this.g = g;
        this.tileWidth = 110;
        this.tileHeight = 110;

        this.square_list = 
        [
        ]

        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                this.square_list.push(new Square(x*this.tileWidth,y*this.tileHeight));
            }
        }
    }
    isPointInsideSquare(x, y){
        return this.square_list.filter(d => 
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
                   .attr('pointer-events', 'none')
                   .style('stroke-width', 2)
                   .style('stroke', 'black'),
                   
           )

    }
}

class Square {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.tile = null;
    }

    AddTile(tile) {
        this.tile = tile;
    }
}