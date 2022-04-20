let observer = null;
let pieces = []
// wrap entire app in an observer to subscribe to a changing state in the most minimal, non-complex way (rather than using EventEmitter or making Game an object model), all that is needed in this case is a stream of values
export const observe = o => {
  if (observer) {
    throw new Error("Multiple observers not implemented.");
  }

  observer = o;
  emitChange();

  // TO-DO: explore purpose of this return statement
  return () => {
    observer = null;
  }
};

const emitChange = () => {
  observer(pieces);
};



export const moveKnight = (toX, toY, piece) => {
  piece.x = toX;
  piece.y = toY;
  pieces.push(piece)
  emitChange();
};
