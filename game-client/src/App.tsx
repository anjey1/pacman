import { useState } from 'react'
import Canvas from "./utils/useWebSocket";
import SnakeMap from "./utils/drawMap";

import './App.css'

function App() {
  const [count, setCount] = useState(0)

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
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );


}

export default App
