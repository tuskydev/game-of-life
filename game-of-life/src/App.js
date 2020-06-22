import React, { useState } from 'react';
import './App.css';
import anon from "./anon.jpg"

const numRows = 20;
const numCols = 35;

function App() {
  const [grid, setGrid] = useState(() => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0));
    }

    return rows
  });

  return (
    <div className="container">
      <div className="heroText">
        <h1 className="mainHeader">Welcome to the Game of Life.</h1>

        <div className="buttonsDiv">
          <button>Start</button>
          <button>Clear</button>
          <button>Randomize</button>
        </div>

        <div className="App" style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 20px)`
        }}>
          {grid.map((rows, i) => 
            rows.map((col, k) => (
              <div 
              className="Grid"
              key = {`${i}-${k}`}
              style={{
                backgroundColor: grid[i][k] ? "goldenrod" : "lightgray"}}>
              </div>
            ))
          )}
                
        </div>
      </div>
    </div>
  );
}

export default App;
