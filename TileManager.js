class TileManager {
    constructor(g, boardManager, gameManager) {
        this.g = g;
        this.boardManager = boardManager;
        this.gameManager = gameManager;
        
        this.tileId = 0;
        this.tile_list = []
        
        this.AddMoreTiles(this.gameManager.CreateTilePrefabs(7))
            //.map((d, i) => new Tile(105*i, 600, d.letter, d.point));
        /*this.tile_list = 
        [
            new Tile(50, 50, 'A', 1),
            new Tile(200, 50, 'D', 3),
            new Tile(350, 50, 'E', 1),
            new Tile(500, 50, 'N', 2),
            new Tile(650, 50, '', 0),
            new Tile(800, 50, 'S', 1)
        ]*/
    }

    AddMoreTiles(tilePrefabs) {
        tilePrefabs.forEach((d, i) => 
        {
            var tile = new Tile(105*i, 600, d.letter, d.point, this.tileId++)
            this.tile_list.push(tile);
            this.boardManager.AddTileToHand(tile);
        });
    }

    Highlight(tile) {
        this.tiles.filter(d => d === tile)
        .style('stroke-width', 5)
        .style("stroke-dasharray", ("10, 3"))
    }

    DeHighlight(tile) {
        this.tiles.filter(d => d === tile)
        .style('stroke-width', 2)
        .style("stroke-dasharray", null)
    }

    draw(){
        var g = this.g;
        var dragged = (d) => {
            if (d.addedToBoard) return;
            d.x = d3.event.x
            d.y = d3.event.y
            var insideSquare = this.boardManager.isPointInsideSquare(d.x, d.y);
            if (insideSquare && !insideSquare.tile) {
                d.x = insideSquare.x+5;
                d.y = insideSquare.y+5;
            }
         }
         var dragended = (d) => {
            if (d.addedToBoard) return;
            g.style('cursor', 'pointer')
            var insideSquare = this.boardManager.isPointInsideSquare(d.x, d.y);
            // is mouse inside square
            if (insideSquare) {
                if (d.currentSquare !== insideSquare) this.DeHighlight(d);
                if (insideSquare.tile && !insideSquare.tile.addedToBoard) {
                    d.currentSquare.AddTile(insideSquare.tile);
                    insideSquare.AddTile(d);
                } else if (!insideSquare.tile){
                    d.currentSquare.ClearTile();
                    insideSquare.AddTile(d);
                }
                // if(insideSquare.tile){ // square alrady has tile
                //     d.currentSquare.AddTile(insideSquare.tile);
                //     insideSquare.AddTile(d);
                // }
                // d.currentSquare.ClearTile();
                // insideSquare.AddTile(d);
            } else if (d.currentSquare){
                // tiles is dropped outside of gameboard
                this.boardManager.PlaceTilesInHand([d]);
                this.DeHighlight(d);
                //d.x = d.currentSquare.x+5;
                //d.y = d.currentSquare.y+5;
            }
         }
         var dragstarted = (d) => {
            if (d.addedToBoard) return;
            window.gameManager.ClickTile(d)
            g.style('cursor', 'grabbing')
         }


        var tile_list = this.tile_list;
        //  tile_list.forEach((d,i) => d.id = i);

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
                   .style('cursor', 'pointer')
                   .on('click', (d) => {window.gameManager.ClickTile(d)})
                   .call(
                       d3.drag()
                       .on('drag', dragged)
                       .on('end', dragended)
                       .on('start', dragstarted) 
                   )
                    ,
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
                   .text(d => !d.isWildcard ? d.point : '') 
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
    constructor(x,y,letter,point,id) {
        this.x = x;
        this.y = y;
        this.letter = letter;
        this.point = point;
        this.id = id;
        this.isWildcard = this.letter === '';
        this.addedToBoard = false;
    }
}