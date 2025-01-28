import React, { useEffect, useRef, useState } from "react";
import Navbar from "./navBar";
import GameOverDialog from "./GameOverDialog";

interface WebSocketData {
  positions: {
    pacman: number[];
    ghosts: number[][];
  };
  state: {
    score: number;
    lives: number;
    game_over: boolean;
  };
}

// Define Canvas component correctly with return type as JSX.Element
const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [positions, setPositions] = useState<number[][]>([]);
  const [score, setScore] = useState<number>(0);
  const [life, setLife] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [images, setImages] = useState<HTMLImageElement[]>([]);

  const drawImages = (
    ctx: CanvasRenderingContext2D,
    images: HTMLImageElement[],
    positions: number[][]
  ) => {

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    images.forEach((image, index) => {
      if (!image.complete) return; // Ensure the image is fully loaded

      const [x, y] = positions[index] || [0, 0];
      const size = 35; // Size of the image to draw

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
      const data: WebSocketData = JSON.parse(event.data);
      setPositions([data.positions['pacman'], ...data.positions['ghosts']]);
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
      arrowWs.close();
      ws.close();
    };
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        drawImages(ctx, images, positions);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [positions]);

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