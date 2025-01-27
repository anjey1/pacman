import React, { useEffect, useRef, useState } from "react";

// Define Canvas component correctly with return type as JSX.Element
const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [circles, setCircles] = useState<number[][]>([]);
  

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

    ws.onopen = () => console.log("WebSocket connected!");
    ws.onmessage = (event) => {
      const data: number[][] = JSON.parse(event.data); // Parse the received data (list of coordinates)
      setCircles(data); // Update state with new circle positions
    };
    ws.onclose = () => console.warn("WebSocket disconnected!");
    ws.onerror = (error) => console.error("WebSocket error:", error);

    return () => ws.close(); // Clean up on component unmount
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
      <h1>WebSocket Circles</h1>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{ border: "1px solid black" }}
      />
    </div>
  )
};

export default Canvas;



// const handleKeyDown = (event: React.KeyboardEvent) => {
//     switch (event.key) {
//         case "ArrowUp":
//             sendAction("UP");
//             break;
//         case "ArrowDown":
//             sendAction("DOWN");
//             break;
//         case "ArrowLeft":
//             sendAction("LEFT");
//             break;
//         case "ArrowRight":
//             sendAction("RIGHT");
//             break;
//         default:
//             break;
//     }
// };

// const handleClick = () => {
//     sendAction("CLICK");
// };