class GameManager {
    constructor(g, boardManager, englishWords) {
        this.g = g;
        this.boardManager = boardManager;
        this.englishWords = englishWords;
        this.totalPoints = 0;
        this.tilesInBagCount = 14;

        this.tilesInBag = 
        [
            new TilePrefab('A', 1, 9),
            new TilePrefab('B', 3, 2),
            new TilePrefab('C', 3, 2),
            new TilePrefab('D', 2, 4),
            new TilePrefab('E', 1, 12),
            new TilePrefab('F', 4, 2),
            new TilePrefab('G', 2, 3),
            new TilePrefab('H', 4, 2),
            new TilePrefab('I', 1, 9),
            new TilePrefab('J', 8, 1),
            new TilePrefab('K', 5, 1),
            new TilePrefab('L', 1, 4),
            new TilePrefab('M', 3, 2),
            new TilePrefab('N', 1, 6),
            new TilePrefab('O', 1, 8),
            new TilePrefab('P', 3, 2),
            new TilePrefab('Q', 10, 1),
            new TilePrefab('R', 1, 6),
            new TilePrefab('S', 1, 4),
            new TilePrefab('T', 1, 6),
            new TilePrefab('U', 1, 4),
            new TilePrefab('V', 4, 2),
            new TilePrefab('W', 4, 2),
            new TilePrefab('X', 8, 1),
            new TilePrefab('Y', 4, 2),
            new TilePrefab('Z', 10, 1),
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

    CreateTilePrefabs(n) {
        n = Math.min(n, this.tilesInBagCount)
        var tilePrefabs = [];
        for (let i = 0; i < n; i++) {
            
            tilePrefabs.push(this.TakeRandomTileFromBag());
        }
        this.tilesInBagCount -= n;
        
        return tilePrefabs
    }

    TakeRandomTileFromBag() {
        var tileCount = this.tilesInBag.reduce((acc, x) => acc + x.count, 0);
        var randomTileIndex = this.random() * tileCount ;
        console.log(randomTileIndex)
        
        var i = 0;
        var currTileIndex = 0;
        while (true) {
            if (currTileIndex >= this.tilesInBag.length) return;
            var tile = this.tilesInBag[currTileIndex++];
            
            if (tile.count + i > randomTileIndex) {
                // must be the right tile!!!
                tile.count--; // reduce count
                return tile;    
                break; // stop iterating
            }

            i += tile.count;
        }

        return tile;
    }


    draw() {

        this.totalPointsText = this.g
            .selectAll('.totalPointsText')
            .data([this.totalPoints])
            .join(enter => 
                enter
                    .append('text')
                    .attr('class', 'totalPointsText')
                    .attr('x', 700 + 75)
                    .attr('y', 0 + 50 + 10)
                    .text(d => `Points: ${d}`)
                    .style('text-anchor', 'middle')
                    .style('fill', 'black')
                    .attr('font-size', 30)
                    .attr('pointer-events', 'none'),
                    
                    update => 
                    update.text(d => `Points: ${d}`)
                )

        var submitButtonY = 700;
        var data = [{id: 0}]
        this.submitButton = this.g
            .selectAll('.submit')
            .data(data, d => d.id)
            .join (enter => 
                enter
                    .append('rect')
                    .attr('class', 'submit')
                    .attr('width', '15%')
                    .attr('height', '10%')
                    .attr('x', '800')
                    .attr('y', submitButtonY)
                   .attr('fill', 'white')
                   .style('stroke-width', 2)
                   .style('stroke', 'black')
                   .style('cursor', 'pointer')
                   .on('mouseover', (d) => 
                   this.submitButton.attr('fill', 'lightgreen')
                   .transition()
                   .duration(100)
                   .attr('height', '11%')
                   ) 
                   .on('mouseout', (d) => 
                   this.submitButton.attr('fill', 'white')
                   .transition()
                   .duration(100)
                   .attr('height', '10%')) 
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
                        .attr('x', 800 + 75)
                        .attr('y', submitButtonY + 50 + 10)
                        .text("Submit")
                        .style('text-anchor', 'middle')
                        .style('fill', 'black')
                        .attr('font-size', 30)
                        .attr('pointer-events', 'none'),
                )
        


    }
    
    ClickTile(tile) {

        if (this.selectedTile === null) {
            // if a tile is selected
        } else {
            this.selectedTile = tile;
        }
    }

    ClickSquare(square) {
        if (this.selectedTile !== null) {
            this.selectedTile 
        }
    }

    UpdateBoard() {
        var wordFound = false;
        var word = "";
        var words = this.FindWords();
        console.log(words);
    }

    FindWords() {
        var squares = this.boardManager.GetSquares();
        var squaresWithNewTiles = squares.filter(s => s.tile && !s.tile.addedToBoard);

        // check that there are newTiles 
        if (squaresWithNewTiles.length === 0) 
        {
            this.boardManager.PlaceTilesInHand(squaresWithNewTiles.map(s => s.tile));
            return new GameInputError("No new tiles, can't submit");
        }

        // check that tiles are placed legally
        var horizontal = 
            squaresWithNewTiles.every(t => t.y === squaresWithNewTiles[0].y);
        var vertical = 
            squaresWithNewTiles.every(t => t.x === squaresWithNewTiles[0].x);
        if (!horizontal && !vertical) {
            this.boardManager.PlaceTilesInHand(squaresWithNewTiles.map(s => s.tile));
            return new GameInputError("Tiles are placed illegally");
        }
        

        // tiles are legally placed, check if all new words are legit 
        var startSquare = squares.filter(s => s.tile && !s.tile.addedToBoard)[0];
        
        var words = []
        if (horizontal) {
            console.log("horizontal search")
            var horiWords = this.SearchForWordHorizontally(startSquare, squares, true);
            words = words.concat(horiWords);
        } 
        else if (vertical) {
            console.log("vertical search")
            var vertWords = this.SearchForWordVertically(startSquare, squares, true);
            words = words.concat(vertWords);
        }

        // check that either the board is empty, or the at least one tile is placed contiguously to existng tile
        var boardIsEmtpy = squares.filter(s => s.tile && s.tile.addedToBoard).length === 0;
        if (!boardIsEmtpy) {
            if (!words.some(word => word.some(tile => tile.addedToBoard))) {
                this.boardManager.PlaceTilesInHand(squaresWithNewTiles.map(s => s.tile));
                return new GameInputError("New tiles/words are not connected to other game tiles");
            }
        }

        // check that tiles are placed contiguously (and/or/with other existing tiles)
        if (horizontal) {
            var min = Math.min.apply(Math, squaresWithNewTiles.map(function(o) { return o.boardX; }))
            var max = Math.max.apply(Math, squaresWithNewTiles.map(function(o) { return o.boardX; }))
            for (let x = min; x < max; x++) {
                var s = squares.filter(s => s.boardX === x && s.y === squaresWithNewTiles[0].y)[0];
                if (s === null || s.tile === null) {
                    this.boardManager.PlaceTilesInHand(squaresWithNewTiles.map(s => s.tile));
                    return new GameInputError("There is a gap between tiles placed on the board");
                }
            }
        } else if (vertical) {
            var min = Math.min.apply(Math, squaresWithNewTiles.map(function(o) { return o.boardY; }))
            var max = Math.max.apply(Math, squaresWithNewTiles.map(function(o) { return o.boardY; }))
            console.log(`${min}, ${max}`)
            for (let y = min; y < max; y++) {
                var s = squares.filter(s => s.boardY === y && s.x === squaresWithNewTiles[0].x)[0];
                if (s === null || s.tile === null) {
                    this.boardManager.PlaceTilesInHand(squaresWithNewTiles.map(s => s.tile));
                    return new GameInputError("There is a gap between tiles placed on the board");
                }
            }
        }
        
        words.filter(w =>w.length > 1).forEach(foundWord => {
            console.log(foundWord.map(t=>t.letter));
            var word = this.DoesListOfTilesWriteWord(foundWord);
            if (word) {
                
                console.log(`Legal word found: ${foundWord.map(t=>t.letter)}`); 
                
            } else {
                this.boardManager.PlaceTilesInHand(squaresWithNewTiles.map(s => s.tile));
                console.log(`Illegal word found: ${foundWord.map(t=>t.letter)}`); 
            }
        });

        if (words.filter(w =>w.length > 1).every(foundWord => this.DoesListOfTilesWriteWord(foundWord))) {
            window.tileManager.AddMoreTiles(this.CreateTilePrefabs(squaresWithNewTiles.map(s => s.tile).filter(t => !t.addedToBoard).length));
            squaresWithNewTiles.map(s => s.tile).forEach(t => t.addedToBoard = true);
            var scoredPoints = words.filter(w => w.length > 1).reduce((allPoints, word) => allPoints + word.reduce((wordPoint, letter) => wordPoint + letter.point, 0) ,0);
            this.totalPoints += scoredPoints;
            console.log(`points: ${scoredPoints}`)
        } else {
            this.boardManager.PlaceTilesInHand(squaresWithNewTiles.map(s => s.tile));
        }
    }

    SearchForWordHorizontally(startSquare, squares, recursive) {
        var foundWord = []
        var words = [foundWord]
        console.log(startSquare.tile.letter)
        // check left
        for (let x = startSquare.boardX; x >= 0; x--) {
            var leftSquare = squares.filter(s => s.boardX === x && s.boardY === startSquare.boardY)[0];
            if (leftSquare && leftSquare.tile) {
                foundWord.unshift(leftSquare.tile);
                if (recursive && !leftSquare.tile.addedToBoard) {
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
            if (rightSquare && rightSquare.tile) {
               foundWord.push(rightSquare.tile);
               if (recursive && !rightSquare.tile.addedToBoard) {
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
        console.log(startSquare.tile.letter)
        for (let y = startSquare.boardY; y >= 0; y--) {
            var leftSquare = squares.filter(s => s.boardY === y && s.boardX === startSquare.boardX)[0];
            if (leftSquare && leftSquare.tile) {
                //horizontalWord = leftSquare.tile.letter + horizontalWord;
                foundWord.unshift(leftSquare.tile);
                if (recursive && !leftSquare.tile.addedToBoard) {
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
            if (rightSquare && rightSquare.tile) {
                // horizontalWord = horizontalWord + rightSquare.tile.letter;
                foundWord.push(rightSquare.tile);
                if (recursive && !rightSquare.tile.addedToBoard) {
                    var word = this.SearchForWordHorizontally(rightSquare, squares, false);
                    words.push(word[0])
                }
            } else {
                break;
            }
        }
        return words
    }

    DoesListOfTilesWriteWord(list) {
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

class TilePrefab{
    constructor(letter, point, count) {
        this.letter = letter;
        this.point = point;
        this.count = count;
    }
}

class GameInputError{
    constructor(msg) {
        this.msg = msg;
    }
}