import React from "react";

export const Square = ({ children }) => {
  const fill = "#85B79D";
  const stroke = "black";
  const squareStyle = {
    backgroundColor: fill,
    color: stroke,
    border: '1px solid white',
    strokeWidth: "10px",
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  };
  return <div style={squareStyle}>{children}</div>;
};
