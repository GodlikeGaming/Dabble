class PieceManager {
    constructor(g, boardManager, gameManager) {
        this.g = g;
        this.boardManager = boardManager;
        this.gameManager = gameManager;
        
        this.pieceId = 0;
        this.pieceList = []
        
        this.AddMorePieces(this.gameManager.CreatePiecePrefabs(7))

    }

    AddMorePieces(piecePrefabs) {
        piecePrefabs.forEach((d, i) => 
        {
            var piece = new Piece(0*i, 600, d.letter, d.point, this.pieceId++)
            this.pieceList.push(piece);
            this.boardManager.AddPieceToHand(piece);
        });
    }

    Highlight(piece) {
        this.pieces.filter(d => d === piece)
        .style('stroke-width', 5)
        .style("stroke-dasharray", ("10, 3"))
    }

    DeHighlight(piece) {
        this.pieces.filter(d => d === piece)
        .style('stroke-width', 2)
        .style("stroke-dasharray", null)
    }

    draw(){
        var g = this.g;
        var dragged = (d) => {
            if (d.addedToBoard) return;
            d.x = d3.event.x
            d.y = d3.event.y
            var insideTile = this.boardManager.isPointInsideTile(d.x, d.y);
            if (insideTile && !insideTile.piece) {
                d.x = insideTile.x;
                d.y = insideTile.y;
            }
         }
         var dragended = (d) => {
            if (d.addedToBoard) return;
            g.style('cursor', 'pointer')
            var insideTile = this.boardManager.isPointInsideTile(d.x, d.y);
            // is mouse inside square
            if (insideTile) {
                if (d.currentTile !== insideTile) this.DeHighlight(d);
                if (insideTile.piece && !insideTile.piece.addedToBoard) {
                    d.currentTile.AddPiece(insideTile.piece);
                    insideTile.AddPiece(d);
                } else if (!insideTile.piece){
                    d.currentTile.ClearTile();
                    insideTile.AddPiece(d);
                }
            } else if (d.currentTile){
                // piece is dropped outside of gameboard
                this.boardManager.PlacePiecesInHand([d]);
                this.DeHighlight(d);
            }
         }
         var dragstarted = (d) => {
            if (d.addedToBoard) return;
            window.gameManager.ClickPiece(d)
            g.style('cursor', 'grabbing')
         }


        var pieceList = this.pieceList;

        var pieceWidth = 100;
        var pieceHeight = 100;
        
        var percentage = window.percentage
        
        this.pieces = g
           .selectAll('.piece')
           .data(pieceList, d => d.id)
           .join(
               enter => enter
                   .append('rect')
                   .attr('class', 'piece')
                   .attr('x', d => `${((d.x))}`)
                   .attr('y', d => d.y)
                   .attr('width', '8.5%')
                   .attr('height', '10%')
                   .attr('fill', 'beige')
                   .style('stroke-width', 2)
                   .style('stroke', 'black')
                   .attr("rx", 10)
                   .style('cursor', 'pointer')
                   .on('click', (d) => {window.gameManager.ClickPiece(d)})
                   .call(
                       d3.drag()
                       .on('drag', dragged)
                       .on('end', dragended)
                       .on('start', dragstarted) 
                   )
                    ,
                   update => update
                   .attr('x', d => `${((d.x))}%`)
                   .attr('y', d => `${d.y}%`)
                   
           )

        this.pieceLetterTexts = g
           .selectAll('.pieceLetterText')
           .data(pieceList, d => d.id)
           .join(
               enter => enter
                   .append('text')
                   .attr('class', 'pieceLetterText')
                   .attr('x', d => d.x + pieceWidth / 2)
                   .attr('y', d => d.y + pieceHeight / 2 + 15)
                   .text(d => d.letter)
                   .style('text-anchor', 'middle')
                   .style('fill', 'black')
                   .attr('font-size', 50)
                   .attr('pointer-events', 'none')
                   .style('font-family', 'interstateBold'),
                   update => update
                   .attr('x', d => d.x + pieceWidth / 2)
                   .attr('y', d => d.y + pieceHeight / 2 + 15)
           )

        this.piecePointTexts = g
           .selectAll('.piecePointText')
           .data(pieceList, d => d.id)
           .join(
               enter => enter
                   .append('text')
                   .attr('class', 'piecePointText')
                   .attr('x', d => d.x + pieceWidth * 0.8)
                   .attr('y', d => d.y + pieceHeight *0.9)
                   .text(d => !d.isWildcard ? d.point : '') 
                   .style('text-anchor', 'middle')
                   .style('fill', 'black')
                   .attr('font-size', 20)
                   .attr('pointer-events', 'none')
                   .style('font-family', 'interstateBold'),
                   update => update
                   .attr('x', d => d.x + pieceWidth * 0.8)
                   .attr('y', d => d.y + pieceHeight *0.9)
                   
                   
           )
    }
}

class Piece {
    constructor(x,y,letter,point,id) {
        this.x = x;
        this.y = y;
        this.letter = letter;
        this.point = point;
        this.id = id;
        this.isWildcard = this.letter === '';
        this.addedToBoard = false;
        this.currentTile;
    }
}