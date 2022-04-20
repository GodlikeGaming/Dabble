import React from "react";
import SquareWrapper from "./SquareWrapper";
import Knight from "../pieces/Knight";
import withDragDropContext from "../../lib/withDragDropContext";

import {GetRandomTile} from "../util/GameLogic.jsx";
const tiles = [];
for (let i = 0; i < 7; i++) {
  tiles.push(GetRandomTile());
}

// chess board component
const Hand = () => {
  

  // generate "smart" squares (aware of piece's position)
  const renderSquare = (i) => {
    var x = i
    // render out the square
    return (
      <div key={i} style={squareStyle}>
        <SquareWrapper x={x}>
          <Knight piece={tiles[i]}/>
        </SquareWrapper>
      </div>
    );
  }


  // populate chess board squares along with any pieces that may be on them
  const squares = [];
  for (let i = 0; i < 7; i++) {
    squares.push(renderSquare(i));
  }
  return (
    <div style={boardStyle}>{squares}</div>
  );

  // CRITICAL NOTE: the bottom return statement would produce the error: "Cannot have two HTML backends at the same time".

  // return (
  //   <DragDropContextProvider backend={HTML5Backend}>
  //     <div style={boardStyle}>{squares}</div>
  //   </DragDropContextProvider>
  // );

  // Need to use the singleton pattern to ensure only a single instance of DragDropContext is initialized throughout app. Credit fix to @gcorne, https://github.com/react-dnd/react-dnd/issues/186#issuecomment-282789420, and @nickangtc for courteously sharing this fix: https://github.com/react-dnd/react-dnd/issues/740#issuecomment-299686690. 
}


// styling properties applied to the board element
const boardStyle = {
  margin: "0 auto",
  width: "100vmin",
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "space-evenly",
  fontSize: "10vmin",
};

// styling properties applied to each square element
const squareStyle = {
  width: "12.5%",
  height: "12.5%",
};

export default withDragDropContext(Hand);
