import React, { useState, useRef, useCallback } from 'react';
import './App.css';
import produce from "immer";
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';

const numRows = 25;
const numCols = 40;

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
  const [open, setOpen] = useState(false)
  const [colorOpen, setColorOpen] = useState(false)  
  const [aboutOpen, setAboutOpen] = useState(false)  
  const [chosenColor, setChosenColor] = useState("goldenrod")
  let [counter, setCounter] = useState(0);
  const [slideValue, setSlideValue] = useState(100)

  const handleSlideChange = (e) => {
    e.preventDefault()

    setSlideValue(e.target.value)
  }

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
    setCounter(counter++);
    setTimeout(runSimulation, slideValue);
  }, [counter, slideValue]);
      
  return (
    <div className="bigCont">
      <div className="heroText">
        <h1 className="mainHeader">Welcome to the Game of Life.</h1>

        <div className="slidecontainer">
          <input 
          id="typeinp" 
          type="range" 
          min="0" max="200" 
          value={slideValue} 
          onChange={handleSlideChange}
          step="5"
          disabled={running ? true : false}
          />
        </div>
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
            setCounter(0)
            if (running) {
              setRunning(!running);
            } 
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
                backgroundColor: grid[i][k] ? chosenColor : "lightgray"}}>
              </div>
            ))
          )}
                
        </div>
        <h2>Generations: {counter}</h2>
        <button className="button" onClick={() => setOpen(true)}>
        Read Rules
        </button>
        <Modal styles={{modal: {background: "red"}}} open={open} onClose={() => setOpen(false)} center>
          <h2 className="rules">Rules:</h2>
          <h3><span>1. </span>Any live cell with two or three live neighbours survives.</h3>
          <h3><span>2. </span>Any dead cell with three live neighbours becomes a live cell.</h3>
          <h3><span>3. </span>All other live cells die in the next generation. Similarly, all other dead cells stay dead.</h3>
        </Modal><br/>
        <button className="button" onClick={() => setAboutOpen(true)}>
        About
        </button>
        <Modal styles={{modal: {background: "lightgray"}}} open={aboutOpen} onClose={() => setAboutOpen(false)} center>
          <h1 className="rules">About</h1>
          <p>The Game of Life, also known simply as Life, is a cellular automaton devised by the British mathematician John Horton Conway in 1970.[1] It is a zero-player game, meaning that its evolution is determined by its initial state, requiring no further input. One interacts with the Game of Life by creating an initial configuration and observing how it evolves. It is Turing complete and can simulate a universal constructor or any other Turing machine.</p>
        </Modal><br/>

        <button className="button" onClick={() => setColorOpen(true)}>
        Open Color Palette
        </button>
        <Modal styles={{modal: {background: "gray"}}} open={colorOpen} onClose={() => setColorOpen(false)} center>
          <h2 style={{marginBottom: "2vw"}} className="rules">Choose a color for your cells</h2>
          <button style={{background: "red", margin: "auto .5vw"}} onClick={() => {
            setChosenColor("red")
            setColorOpen(false)
          }}>Red</button>
          <button style={{background: "green", margin: "auto .5vw"}} onClick={() => {
            setChosenColor("green")
            setColorOpen(false)
          }}>Green</button>
          <button style={{background: "blue", margin: "auto .5vw"}} onClick={() => {
            setChosenColor("blue")
            setColorOpen(false)
          }}>Blue</button>
          <button style={{background: "yellow", margin: "auto .5vw"}} onClick={() => {
            setChosenColor("goldenrod")
            setColorOpen(false)
          }}>Yellow</button>

        </Modal>
      </div>
    </div>
  );
}

export default App;
