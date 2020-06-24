import React, { useState, useRef, useCallback } from 'react';
import './App.css';
import produce from "immer";

const numRows = 20;
const numCols = 35;

const operations = [
  [-1, 1],
  [0, 1],
  [1, 1],
  [-1, 0],
  [1, 0],
  [-1, -1],
  [0, -1],
  [1, -1],
  
]

const generateEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }

  return rows
}

function App() {
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid()
  });

  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid(g => {
      return produce(g, gridCopy => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                neighbors += g[newI][newK]
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0;
            } else if (g[i][k] === 0 && neighbors === 3) {
              gridCopy[i][k] = 1;
            }
          }
        }
      })
    })
    
    setTimeout(runSimulation, 100);
    }, []);

    
  return (
    <div className="container">
      <div className="heroText">
        <h1 className="mainHeader">Welcome to the Game of Life.</h1>

        <div className="buttonsDiv">
          <button onClick={() => {
            setRunning(!running);
            if (!running) {
              runningRef.current = true;
              runSimulation();
            }
          }}>{running ? "Stop" : "Start"}</button>
          <button onClick={() => {
            setGrid(generateEmptyGrid());
          }}>Clear</button>
          <button onClick={() => {
              const rows = [];
              for (let i = 0; i < numRows; i++) {
                rows.push(Array.from(Array(numCols), () => Math.random() > .7 ? 1 : 0));
              }
          
              setGrid(rows);
          }}>Randomize</button>
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
              onClick={() => {
                const newGrid = produce(grid, gridCopy => {
                  gridCopy[i][k] = grid[i][k] ? 0 : 1;
                })
                setGrid(newGrid);
              }}
              style={{
                backgroundColor: grid[i][k] ? "goldenrod" : "lightgray"}}>
              </div>
            ))
          )}
                
        </div>
        <div className="rulesBox">
          <h2 className="rules">Rules:</h2>
          <h3><span>1. </span>Any live cell with two or three live neighbours survives.</h3>
          <h3><span>2. </span>Any dead cell with three live neighbours becomes a live cell.</h3>
          <h3><span>3. </span>All other live cells die in the next generation. Similarly, all other dead cells stay dead.</h3>
        </div>
      </div>
    </div>
  );
}

export default App;
