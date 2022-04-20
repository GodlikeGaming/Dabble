class TileManager {
    constructor(g, boardManager) {
        this.g = g;
        this.tile_list = 
        [
            new Tile(50, 50, 'A', 1),
            new Tile(200, 50, 'D', 3),
            new Tile(350, 50, 'E', 1),
            new Tile(500, 50, 'N', 2)
        ]
        this.boardManager = boardManager;
    }

    draw(){
        var g = this.g;
        var dragged = (d) => {
            d.x = d3.event.x
            d.y = d3.event.y

            var insideSquare = this.boardManager.isPointInsideSquare(d.x, d.y);
            if (insideSquare && !insideSquare.tile) {
                d.x = insideSquare.x;
                d.y = insideSquare.y;
            }
         }
         var dragended = (d) => {
            g.style('cursor', 'pointer')
            var insideSquare = this.boardManager.isPointInsideSquare(d.x, d.y);
            if (insideSquare) {
                insideSquare.AddTile(d);
            }
         }
         var dragstarted = (d) => {
            g.style('cursor', 'grabbing')
         }


        var tile_list = this.tile_list;
        tile_list.forEach((d,i) => d.id = i);

        var tileWidth = 100;
        var tileHeight = 100;
        
        this.tiles = g
           .selectAll('.tile')
           .data(tile_list, d => d.id)
           .join(
               enter => enter
                   .append('rect')
                   .attr('class', 'tile')
                   .attr('x', d => d.x)
                   .attr('y', d => d.y)
                   .attr('width', '10%')
                   .attr('height', '10%')
                   .attr('fill', 'beige')
                   .style('stroke-width', 2)
                   .style('stroke', 'black')
                   .attr("rx", 10)
                   .call(
                       d3.drag()
                       .on('drag', dragged)
                       .on('end', dragended)
                       .on('start', dragstarted) 
                   ),
                   update => update
                   .attr('x', d => d.x)
                   .attr('y', d => d.y)
                   
           )

        this.tileLetterTexts = g
           .selectAll('.tileLetterText')
           .data(tile_list, d => d.id)
           .join(
               enter => enter
                   .append('text')
                   .attr('class', 'tileLetterText')
                   .attr('x', d => d.x + tileWidth / 2)
                   .attr('y', d => d.y + tileHeight / 2 + 15)
                   .text(d => d.letter)
                   .style('text-anchor', 'middle')
                   .style('fill', 'black')
                   .attr('font-size', 50)
                   .attr('pointer-events', 'none'),
                   update => update
                   .attr('x', d => d.x + tileWidth / 2)
                   .attr('y', d => d.y + tileHeight / 2 + 15)
           )

        this.tilePointTexts = g
           .selectAll('.tilePointText')
           .data(tile_list, d => d.id)
           .join(
               enter => enter
                   .append('text')
                   .attr('class', 'tilePointText')
                   .attr('x', d => d.x + tileWidth * 0.8)
                   .attr('y', d => d.y + tileHeight *0.9)
                   .text(d => d.point)
                   .style('text-anchor', 'middle')
                   .style('fill', 'black')
                   .attr('font-size', 20)
                   .attr('pointer-events', 'none'),
                   update => update
                   .attr('x', d => d.x + tileWidth * 0.8)
                   .attr('y', d => d.y + tileHeight *0.9)
                   
                   
           )
    }
}

class Tile {
    constructor(x,y,letter,point) {
        this.x = x;
        this.y = y;
        this.letter = letter;
        this.point = point;
    }
}