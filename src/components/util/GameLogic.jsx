import {PieceClass} from './PieceClass'
const tiles = [
    {letter: "A", points: 1},
    {letter: "B", points: 1},
    {letter: "C", points: 1},
    {letter: "D", points: 1},
    {letter: "E", points: 1},
    {letter: "F", points: 1},
    {letter: "G", points: 1},
    {letter: "H", points: 1},
    {letter: "I", points: 1},
    {letter: "J", points: 1},
    {letter: "K", points: 1},
    {letter: "L", points: 1},
    {letter: "M", points: 1},
    {letter: "N", points: 1},
    {letter: "O", points: 1},
    {letter: "P", points: 1},
    {letter: "Q", points: 1},
    {letter: "R", points: 1},
    {letter: "S", points: 1},
    {letter: "T", points: 1},
    {letter: "U", points: 1},
    {letter: "V", points: 1},
    {letter: "W", points: 1},
    {letter: "X", points: 1},
    {letter: "Y", points: 1},
    {letter: "Z", points: 1}
]

var seed = 1;
function random() {
    var x = Math.sin(seed++) * 10000; 
    return x - Math.floor(x);
}

export const GetRandomTile = () =>  {
    var tile = tiles[Math.floor(random()*tiles.length)];
    return new PieceClass(0, 0, tile.letter) 
}


