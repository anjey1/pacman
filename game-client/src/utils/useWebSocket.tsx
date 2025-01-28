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
  const [images, setImages] = useState<HTMLImageElement[]>([]);

  const drawImages = (
    ctx: CanvasRenderingContext2D,
    images: HTMLImageElement[],
    positions: number[][]
  ) => {
    // Clear the canvas before drawing
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Iterate through the images and draw each one at the specified position
    images.forEach((image, index) => {
      if (!image.complete) return; // Ensure the image is fully loaded

      const [x, y] = positions[index] || [0, 0]; // Default to [0, 0] if no position is provided
      const size = 35; // Size of the image to draw

      // Draw the image centered at (x, y)
      ctx.drawImage(image, x - size / 2 + 5, y - size / 2 - 5, size, size);
    });
  };

  // Preload images and store them in state
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];

    const imageSrc = [
      "/assets/pacman.png",
      "/assets/enemy1.svg",
      "/assets/enemy2.svg",
      "/assets/enemy3.svg",
    ]

    let loadedCount = 0;

    imageSrc.forEach((src, index) => {
      const img = new Image();
      img.src = src;

      img.onload = () => {
        loadedCount++;
        loadedImages[index] = img;

        // Once all images are loaded, update the state
        if (loadedCount === imageSrc.length) {
          setImages(loadedImages);
        }
      };

      img.onerror = () => {
        console.error(`Failed to load image: ${src}`);
      };
    });
  }, []);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws");
    const arrowWs = new WebSocket("ws://localhost:8000/ws/arrow"); // Connect to the arrow key WebSocket

    ws.onopen = () => console.log("WebSocket connected!");
    ws.onmessage = (event) => {
      const data: number[][] = JSON.parse(event.data); // Parse the received data (list of coordinates)
      setCircles([data.positions['pacman'], ...data.positions['ghosts']]); // Update state with new circle positions
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
        drawImages(ctx, images, circles);
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
      />
    </div>
  )
};

export default Canvas;