import React, { useEffect, useRef, useState } from "react";
import Navbar from "./navBar";
import GameOverDialog from "./GameOverDialog";

// Define Canvas component correctly with return type as JSX.Element
const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [circles, setCircles] = useState<number[][]>([]);
  const [score, setScore] = useState<number>(0);
  const [life, setLife] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [arrowKey, setArrowKey] = useState<string>("");

  const drawCircles = (ctx: CanvasRenderingContext2D, circles: number[][]) => {
    // Clear the canvas before each redraw
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    circles.forEach((circle, index) => {
      const [x, y] = circle;
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2); // Draw a circle with radius 20
      ctx.fillStyle = index === 0 ? "yellow" : "red"; // Set color based on index
      ctx.fill();
    });
  };

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws");
    const arrowWs = new WebSocket("ws://localhost:8000/ws/arrow"); // Connect to the arrow key WebSocket

    ws.onopen = () => console.log("WebSocket connected!");
    ws.onmessage = (event) => {
      const data: number[][] = JSON.parse(event.data); // Parse the received data (list of coordinates)
      setCircles([data.positions['pacman'], data.positions['ghosts']]); // Update state with new circle positions
      setScore(data.state['score'])
      setLife(data.state['lives'])
      setGameOver(data.state['game_over'])
    };
    ws.onclose = () => console.warn("WebSocket disconnected!");
    ws.onerror = (error) => console.error("WebSocket error:", error);

    arrowWs.onopen = () => console.log("Arrow key WebSocket connected!");

    // Send the arrow key press when a key is pressed
    const handleKeyDown = (event: KeyboardEvent) => {
      const direction = event.key.toLowerCase();
      if (['arrowleft', 'arrowright', 'arrowup', 'arrowdown'].includes(direction)) {
        arrowWs.send(JSON.stringify({ arrow: direction }));
        setArrowKey(direction); // Update state with the pressed key for display
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      arrowWs.close(); // Clean up arrow key WebSocket
      ws.close(); // Clean up WebSocket connection
    };
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        drawCircles(ctx, circles); // Redraw the circles whenever the state changes
      }
    }
  }, [circles]); // Re-run drawCircles whenever circles change

  return (
    <div>
      <Navbar score={score} life={life} />
      <GameOverDialog gameOver={gameOver} />
      <canvas
        ref={canvasRef}
        width={740}
        height={780}
        style={{ border: "1px solid black" }}
      />
    </div>
  )
};

export default Canvas;