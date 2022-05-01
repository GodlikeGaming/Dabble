class GameManager {
    
    constructor(g, boardManager, englishWords) {
        this.g = g;
        this.boardManager = boardManager;
        this.englishWords = englishWords;
        this.totalPoints = 0;
        //this.numberOfPiecesLeftInBag = 14 - 7;
        this.maxNumberOfPieces = 21;
        // mouse controls
        this.selectedPiece = null;
        this.currentStatusMessage = {msg: "", id: 0};
        // move count variables
        this.maxNumberOfMoves = 7;
        this.numberOfMoves = 0;

        this.piecesInBag = 
        [
            new PiecePrefab('A', 1, 9),
            new PiecePrefab('B', 3, 2),
            new PiecePrefab('C', 3, 2),
            new PiecePrefab('D', 2, 4),
            new PiecePrefab('E', 1, 12),
            new PiecePrefab('F', 4, 2),
            new PiecePrefab('G', 2, 3),
            new PiecePrefab('H', 4, 2),
            new PiecePrefab('I', 1, 9),
            new PiecePrefab('J', 8, 1),
            new PiecePrefab('K', 5, 1),
            new PiecePrefab('L', 1, 4),
            new PiecePrefab('M', 3, 2),
            new PiecePrefab('N', 1, 6),
            new PiecePrefab('O', 1, 8),
            new PiecePrefab('P', 3, 2),
            new PiecePrefab('Q', 10, 1),
            new PiecePrefab('R', 1, 6),
            new PiecePrefab('S', 1, 4),
            new PiecePrefab('T', 1, 6),
            new PiecePrefab('U', 1, 4),
            new PiecePrefab('V', 4, 2),
            new PiecePrefab('W', 4, 2),
            new PiecePrefab('X', 8, 1),
            new PiecePrefab('Y', 4, 2),
            new PiecePrefab('Z', 10, 1),
        ]
        // set seed by getting the current date and rounding to nearest day and then to ticks
        var today = new Date();
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        today.setMilliseconds(0);
        this.seed = today.getTime();
    }

    random() {
        var x = Math.sin(this.seed++) * 10000;
        return x - Math.floor(x);
    }

    CreatePiecePrefabs(n) {
        n = Math.min(n, this.maxNumberOfPieces)
        var tilePrefabs = [];
        for (let i = 0; i < n; i++) {
            
            tilePrefabs.push(this.TakeRandomPieceFromBag());
        }
        this.maxNumberOfPieces -= n;
        
        return tilePrefabs
    }

    EndGame() {
        var handPieces = this.boardManager.GetHandPieces();
        var minusPoints = handPieces.reduce((acc, x) => acc + x.point, 0)
        console.log(`Final score: ${this.totalPoints - minusPoints}`)

        var shareString = `Total points: ${this.totalPoints - minusPoints}\n`
        var boardSquares = this.boardManager.GetBoardSquares();
        for (let y = 0; y < this.boardManager.boardHeight; y++) {
            for (let x= 0; x < this.boardManager.boardWidth; x++) {
                if (boardSquares.filter(bs => bs.boardX === x && bs.boardY === y)[0].piece !== null) {
                    shareString += '🟩'
                } else {
                    shareString += '⬛'
                }
            }
            shareString += '\n';
        }
        console.log(shareString)
    }

    TakeRandomPieceFromBag() {
        var pieceCount = this.piecesInBag.reduce((acc, x) => acc + x.count, 0);
        var randomPieceIndex = this.random() * pieceCount ;
        
        var i = 0;
        var currPieceIndex = 0;
        while (true) {
            if (currPieceIndex >= this.piecesInBag.length) return;
            var piece = this.piecesInBag[currPieceIndex++];
            
            if (piece.count + i > randomPieceIndex) {
                // must be the right tile!!!
                piece.count--; // reduce count
                return piece;    
                break; // stop iterating
            }

            i += piece.count;
        }

        return piece;
    }


    draw() {
        /*
        d3.select("body")
        .on('click', d => {
            if (this.selectedTile !== null) {
                this.boardManager.PlaceTilesInHand([d]);
                window.tileManager.DeHighlight(d);
            }
        })*/
        this.movesCountText = this.g
            .selectAll('.movesCountText')
            .data([this.numberOfMoves])
            .join(enter => 
                enter
                    .append('text')
                    .attr('class', 'movesCountText')
                    .attr('x', `${ window.width * 0.1}`)
                    .attr('y', '4%')
                    .text(d => `Moves used: ${this.numberOfMoves} / ${this.maxNumberOfMoves}`)
                    .style('fill', 'black')
                    .style('font-family', 'interstateBold')
                    .attr('font-size', 20)
                    .attr('pointer-events', 'none'),
                    
                    update => 
                    update.text(d => `Moves used: ${this.numberOfMoves} / ${this.maxNumberOfMoves}`)
                )

        this.totalPointsText = this.g
            .selectAll('.totalPointsText')
            .data([this.totalPoints])
            .join(enter => 
                enter
                    .append('text')
                    .attr('class', 'totalPointsText')
                    .attr('x', `${0.9* window.width }`)
                    .attr('y', '4%')
                    .style('text-anchor', 'end')
                    .text(d => `Points: ${d}`)
                    .style('fill', 'black')
                    .style('font-family', 'interstateBold')
                    .attr('font-size', 20)
                    .attr('pointer-events', 'none'),
                    
                    update => 
                    update.text(d => `Points: ${d}`)
                )
        
        this.maxNumberOfPiecesText = this.g
            .selectAll('.maxNumberOfPiecesText')
            .data([this.maxNumberOfPieces])
            .join(enter => 
                enter
                    .append('text')
                    .attr('class', 'maxNumberOfPiecesText')
                    .attr('x', `${0.50* window.width }`)
                    .attr('y', '4%')
                    .style('text-anchor', 'middle')
                    .text(d => `Pieces left in bag: ${d}`)
                    .style('fill', 'black')
                    .style('font-family', 'interstateBold')
                    .attr('font-size', 20)
                    .attr('pointer-events', 'none'),
                    
                    update => 
                    update.text(d => `Pieces left in bag: ${d}`)
                )

        // button koordinates
        var concedeButtonX = '12.5%'
        var concedeButtonY = `${window.width*1}`

        var shuffleButtonX = '43.75%';
        var shuffleButtonY = `${window.width*1}`
        
        var submitButtonX = '75%';
        var submitButtonY = `${window.width*1}`

        // button implementation
        var data = [{id: 0}]
        this.shuffleButton = this.g
            .selectAll('.shuffle')
            .data(data, d => d.id)
            .join (enter => 
                enter
                    .append('rect')
                    .attr('class', 'shuffle')
                    .attr('width', '12.5%')
                    .attr('height', '5%')
                    .attr('x', shuffleButtonX)
                    .attr('y', shuffleButtonY)
                   .attr('fill', 'white')
                   .style('stroke-width', 2)
                   .style('stroke', 'black')
                   .style('cursor', 'pointer')
                   .on('mouseover', (d) => 
                   this.shuffleButton.attr('fill', 'lightgreen')
                   //.transition()
                   //.duration(100)
                   //.attr('height', '11%')
                   ) 
                   .on('mouseout', (d) => 
                   this.shuffleButton.attr('fill', 'white')
                   //.transition()
                   //.duration(100)
                  // .attr('height', '10%')
                  ) 
                    .on('click', (d) => {
                        this.ShufflePieces()})
                )

                this.shuffleText = this.g
                .selectAll('.shuffleText')
                .data(data, d => d.id)
                .join (enter => 
                    enter
                        .append('text')
                        .attr('class', 'shuffleText')
                        .attr('x', shuffleButtonX)
                        .attr('y', shuffleButtonY)
                        .text("Shuffle")
                        //.style('text-anchor', 'start')
                        .style('fill', 'black')
                        .style('font-family', 'interstateBold')
                        .attr('font-size', 30)
                        .attr('pointer-events', 'none'),
                )


        
        var data = [{id: 0}]
        this.submitButton = this.g
            .selectAll('.submit')
            .data(data, d => d.id)
            .join (enter => 
                enter
                    .append('rect')
                    .attr('class', 'submit')
                    .attr('width', '12.5%')
                    .attr('height', '5%')
                    .attr('x', submitButtonX)
                    .attr('y', submitButtonY)
                   .attr('fill', 'white')
                   .style('stroke-width', 2)
                   .style('stroke', 'black')
                   .style('cursor', 'pointer')
                   .on('mouseover', (d) => 
                   this.submitButton.attr('fill', 'lightgreen')
 
                   ) 
                   .on('mouseout', (d) => 
                   this.submitButton.attr('fill', 'white')

                    )                   
                    .on('click', (d) => {
                        this.UpdateBoard()})
                )

                this.submitText = this.g
                .selectAll('.submitText')
                .data(data, d => d.id)
                .join (enter => 
                    enter
                        .append('text')
                        .attr('class', 'submitText')
                        .attr('x', submitButtonX)
                        .attr('y', shuffleButtonY)
                        .text("Submit")
                        //.style('text-anchor', 'middle')
                        .style('fill', 'black')
                        .style('font-family', 'interstateBold')
                        .attr('font-size', 30)
                        .attr('pointer-events', 'none'),
                )

                this.concedeButton = this.g
                .selectAll('.concede')
                .data(data, d => d.id)
                .join (enter => 
                    enter
                        .append('rect')
                        .attr('class', 'concede')
                        .attr('width', '12.5%')
                        .attr('height', '5%')
                        .attr('x', concedeButtonX)
                        .attr('y', concedeButtonY)
                       .attr('fill', 'white')
                       .style('stroke-width', 2)
                       .style('stroke', 'black')
                       .style('cursor', 'pointer')
                       .on('mouseover', (d) => 
                       this.concedeButton.attr('fill', 'lightgreen')
       
                       ) 
                       .on('mouseout', (d) => 
                       this.concedeButton.attr('fill', 'white')
                     
                       ) 
                        .on('click', (d) => {
                            this.EndGame()})
                    )
                this.concedeText = this.g
                .selectAll('.concedeText')
                .data(data, d => d.id)
                .join (enter => 
                    enter
                        .append('text')
                        .attr('class', 'concedeText')
                        .attr('x', concedeButtonX)
                        .attr('y', shuffleButtonY)
                        .text("Concede")
                        //.style('text-anchor', 'middle')
                        .style('fill', 'black')
                        .style('font-family', 'interstateBold')
                        .attr('font-size', 30)
                        .attr('pointer-events', 'none'),
                )
        
            // this.statusMsg = this.g
            //     .selectAll('.statusMessage')
            //     .data([{msg: "", id: 0}], d => d.id)
            //     join (enter => 
            //         enter
            //             .append('text')
            //             .attr('class', 'statusMessage')
            //             .attr('x', 500)
            //             .attr('y', 500)
            //             .text(d => d.msg)
            //             .style('text-anchor', 'middle')
            //             .style('fill', 'black')
            //             .attr('font-size', 30)
            //     )
            
            this.statusMsg = this.g
            .selectAll('.t')
            .data([this.currentStatusMessage], d => d.id)
            .join (enter => 
                enter
                    .append('text')
                    .attr('class', 't')
                    .attr('x', 400 + 75)
                    .attr('y', 50 + 50 + 10)
                    .text(d => d.msg)
                    .style('text-anchor', 'middle')
                    .style('fill', 'white')
                    .attr('font-size', 50)
                    .attr('pointer-events', 'none'),
                update => update.text(d => d.msg)
            )

    }
    
    ClickPiece(piece) {
        if (piece.addedToBoard) return;
        if (this.selectedPiece !== null) {
            // if a tile is selected
            window.pieceManager.DeHighlight(this.selectedPiece);
        } 

        window.pieceManager.Highlight(piece);
        this.selectedPiece = piece;
        
    }

    ClickTile(tile) {
        if (this.selectedPiece !== null) {
            this.selectedPiece.currentTile.ClearTile();
            tile.AddPiece(this.selectedPiece);
            window.pieceManager.DeHighlight(this.selectedPiece);
            this.selectedPiece = null;
        }
    }

    UpdateBoard() {
        var tiles = this.boardManager.GetSquares();
        var tilesWithNewPieces = tiles.filter(s => s.piece && !s.piece.addedToBoard);
        var newPieces = tilesWithNewPieces.map(t => t.piece)
        var response = this.FindWords();
        // updates number of words placed
        if (response.success)
        {
            window.pieceManager.colorValidMove(newPieces)
            this.numberOfMoves ++
            if (this.numberOfMoves === this.maxNumberOfMoves)
            {
                this.EndGame()
            }
        }
        else
        {
            this.boardManager.colorInvalidMove(tilesWithNewPieces)
            if (response.msg === "Word is not included in list")
            {
                this.currentStatusMessage.msg = response.msg;
                this.statusMsg.interrupt()
                this.statusMsg
                .style('opacity', 1)
                .style('fill','white')
                .style('paint-order', 'stroke')
                .style('stroke-width', '5px')
                .style('stroke','black')
                .transition()
                .duration(5000)
                .style('opacity', 0)
            }
        }

        console.log(response);
    }

    ShufflePieces() {
        var tilesInHand = this.boardManager.handTileList;
        var piecesInHand = tilesInHand.filter(p => p.piece !== null).map(t => t.piece)
        var shufflePieces = piecesInHand.map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)

        tilesInHand.forEach(t => t.ClearTile())
        this.boardManager.PlacePiecesInHand(shufflePieces)
    }

    FindWords() {
        var tiles = this.boardManager.GetSquares();
        var tilesWithNewPieces = tiles.filter(s => s.piece && !s.piece.addedToBoard);

        // check that there are newTiles 
        if (tilesWithNewPieces.length === 0) 
        {
            this.boardManager.PlacePiecesInHand(tilesWithNewPieces.map(s => s.piece));
            return new GameSubmitResponse("No new tiles, can't submit");
        }

        // check that tiles are placed legally
        var horizontal = 
            tilesWithNewPieces.every(t => t.y === tilesWithNewPieces[0].y);
        var vertical = 
            tilesWithNewPieces.every(t => t.x === tilesWithNewPieces[0].x);
        if (!horizontal && !vertical) {
            this.boardManager.PlacePiecesInHand(tilesWithNewPieces.map(s => s.piece));
            return new GameSubmitResponse("Tiles are placed illegally");
        }
        

        // tiles are legally placed, check if all new words are legit 
        var startSquare = tiles.filter(s => s.piece && !s.piece.addedToBoard)[0];
        
        var words = []
        if (horizontal) {
            console.log("horizontal search")
            var horiWords = this.SearchForWordHorizontally(startSquare, tiles, true);
            words = words.concat(horiWords);
        } 
        else if (vertical) {
            console.log("vertical search")
            var vertWords = this.SearchForWordVertically(startSquare, tiles, true);
            words = words.concat(vertWords);
        }

        // check that either the board is empty, or the at least one tile is placed contiguously to existng tile
        var boardIsEmtpy = tiles.filter(s => s.piece && s.piece.addedToBoard).length === 0;
        if (!boardIsEmtpy) {
            if (!words.some(word => word.some(piece => piece.addedToBoard))) {
                this.boardManager.PlacePiecesInHand(tilesWithNewPieces.map(s => s.piece));
                return new GameSubmitResponse("New tiles/words are not connected to other game tiles");
            }
        }

        // check that tiles are placed contiguously (and/or/with other existing tiles)
        if (horizontal) {
            var min = Math.min.apply(Math, tilesWithNewPieces.map(function(o) { return o.boardX; }))
            var max = Math.max.apply(Math, tilesWithNewPieces.map(function(o) { return o.boardX; }))
            for (let x = min; x < max; x++) {
                var s = tiles.filter(s => s.boardX === x && s.y === tilesWithNewPieces[0].y)[0];
                if (s === null || s.piece === null) {
                    this.boardManager.PlacePiecesInHand(tilesWithNewPieces.map(s => s.piece));
                    return new GameSubmitResponse("There is a gap between tiles placed on the board");
                }
            }
        } else if (vertical) {
            var min = Math.min.apply(Math, tilesWithNewPieces.map(function(o) { return o.boardY; }))
            var max = Math.max.apply(Math, tilesWithNewPieces.map(function(o) { return o.boardY; }))
            console.log(`${min}, ${max}`)
            for (let y = min; y < max; y++) {
                var s = tiles.filter(s => s.boardY === y && s.x === tilesWithNewPieces[0].x)[0];
                if (s === null || s.piece === null) {
                    this.boardManager.PlacePiecesInHand(tilesWithNewPieces.map(s => s.piece));
                    return new GameSubmitResponse("There is a gap between tiles placed on the board");
                }
            }
        }
        
        words.filter(w =>w.length > 1).forEach(foundWord => {
            var word = this.DoesListOfPiecesWriteWord(foundWord);
            if (word) {
                console.log(`Legal word found: ${foundWord.map(t=>t.letter)}`); 
                
            } else {
                //this.boardManager.PlaceTilesInHand(squaresWithNewTiles.map(s => s.tile));
                console.log(`Illegal word found: ${foundWord.map(t=>t.letter)}`); 
            }
        });

        if (words.filter(w =>w.length > 1).every(foundWord => this.DoesListOfPiecesWriteWord(foundWord))) {
            window.pieceManager.AddMorePieces(this.CreatePiecePrefabs(tilesWithNewPieces.map(s => s.piece).filter(t => !t.addedToBoard).length));
            
            tilesWithNewPieces.map(s => s.piece).forEach(t => t.addedToBoard = true);
            var scoredPoints = words.filter(w => w.length > 1).reduce((allPoints, word) => allPoints + word.reduce((wordPoint, letter) => wordPoint + letter.point, 0) ,0);
            this.totalPoints += scoredPoints;
            console.log(`points: ${scoredPoints}`)
            console.log(words);
            var str = words.filter(w =>w.length > 1).reduce((acc, x) => acc + `${x.reduce((acc2, x2) => acc2 + x2.letter, "")}, `, "");
            console.log(str)
            return new GameSubmitResponse(`Found words:\n ${str}`, true);
        } else {
            this.boardManager.PlacePiecesInHand(tilesWithNewPieces.map(s => s.piece));
            return new GameSubmitResponse(`Word is not included in list`)
        }
    }

    SearchForWordHorizontally(startSquare, squares, recursive) {
        var foundWord = []
        var words = [foundWord]
        // check left
        for (let x = startSquare.boardX; x >= 0; x--) {
            var leftSquare = squares.filter(s => s.boardX === x && s.boardY === startSquare.boardY)[0];
            if (leftSquare && leftSquare.piece) {
                foundWord.unshift(leftSquare.piece);
                if (recursive && !leftSquare.piece.addedToBoard) {
                    var word = this.SearchForWordVertically(leftSquare, squares, false);
                    words.push(word[0])
                }
            } else {
                break;
            }
        }
        // check right
        for (let x = startSquare.boardX+1; x < this.boardManager.boardWidth; x++) {
            var rightSquare = squares.filter(s => s.boardX === x && s.boardY === startSquare.boardY)[0];
            if (rightSquare && rightSquare.piece) {
               foundWord.push(rightSquare.piece);
               if (recursive && !rightSquare.piece.addedToBoard) {
                    var word = this.SearchForWordVertically(rightSquare, squares, false);
                    words.push(word[0])
               }
            } else {
                break;
            }
        }
        return words
    }

    SearchForWordVertically(startSquare, squares, recursive) {
        var foundWord = []
        var words = [foundWord] 
        for (let y = startSquare.boardY; y >= 0; y--) {
            var leftSquare = squares.filter(s => s.boardY === y && s.boardX === startSquare.boardX)[0];
            if (leftSquare && leftSquare.piece) {
                foundWord.unshift(leftSquare.piece);
                if (recursive && !leftSquare.piece.addedToBoard) {
                    var word = this.SearchForWordHorizontally(leftSquare, squares, false);
                    words.push(word[0])
                }
            } else {
                break;
            }
        }
        // check horizontally to the right
        for (let y = startSquare.boardY+1; y < this.boardManager.boardHeight; y++) {
            var rightSquare = squares.filter(s => s.boardY === y && s.boardX === startSquare.boardX)[0];
            if (rightSquare && rightSquare.piece) {
                // horizontalWord = horizontalWord + rightSquare.tile.letter;
                foundWord.push(rightSquare.piece);
                if (recursive && !rightSquare.piece.addedToBoard) {
                    var word = this.SearchForWordHorizontally(rightSquare, squares, false);
                    words.push(word[0])
                }
            } else {
                break;
            }
        }
        return words
    }

    DoesListOfPiecesWriteWord(list) {
        if (list.filter(t => t.isWildcard)[0]) { // list contains wildcard
            const alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
            var allPossibleWords = alphabet.map(l => list.map(t => t.isWildcard ? l : t.letter).reduce((acc,e) => acc+e, ""))
            return allPossibleWords.filter(w => this.IsWord(w))
        }
        var word = list.map(t => t.letter).reduce((acc,e) => acc+e, "");
        return this.IsWord(word) ? list.map(t => t.letter).reduce((acc,e) => acc+e, "") : null
    }

    IsWord(word) {
        return this.englishWords.words.includes(word.toUpperCase());
    }
}

class PiecePrefab{
    constructor(letter, point, count) {
        this.letter = letter;
        this.point = point;
        this.count = count;
    }
}

class GameSubmitResponse{
    constructor(msg, success=false) {

        this.msg = msg;
        this.success = success;
    }
}