import { useState } from 'react'
import Canvas from "./utils/useWebSocket";
import SnakeMap from "./utils/drawMap";

import './App.css'

function App() {
  const [score, setScore] = useState(110)

  return (
    <>
      <div className="game">
        <div>
          <Canvas />
        </div>
        <div className="snake-map">
          <SnakeMap />
        </div>
      </div>
    </>
  );


}

export default App
