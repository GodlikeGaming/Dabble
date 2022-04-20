import React, { useState, useEffect } from "react";
import Board from "./components/board/Board";
import Hand from "./components/board/Hand";
import { observe } from "./components/util/KnightObserver";
import {PieceClass} from "./components/util/PieceClass"
import "./stylesheets/global.css";

// chess board demo
const App = () => {
  // since all that is needed in this simple demo is a stream of values, entire app is wrapped by an observer that subscribes to a changing state in the most minimal, non-complex way (rather than using EventEmitter or making Game an object model)
  const [boardTiles, setBoardTiles] = useState([new PieceClass(0, 0), new PieceClass(5, 5)]);
  // the observe function will return an unsubscribe callback
  useEffect(() =>
    observe(
      newBoardTiles => setBoardTiles(newBoardTiles)
    )
  );
  return (
    <div>
      <Board pieces={boardTiles} />      
      <br/>
      <Hand/>      
    </div>
  );
}

export default App;
