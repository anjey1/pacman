import React, { useRef, useEffect } from "react";

const TILE_SIZE = 32;
const WIDTH = 640;
const HEIGHT = 480;

const MAP = [
    "###################",
    "#........#........#",
    "#.###.#.#.#.#.###.#",
    "#.#...#...#...#...#",
    "#.#.#.#.###.#.#.#.#",
    "#.....#.....#.....#",
    "###################",
];

const SnakeMap: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const drawMap = (ctx: CanvasRenderingContext2D) => {
        for (let row = 0; row < MAP.length; row++) {
            for (let col = 0; col < MAP[row].length; col++) {
                const tile = MAP[row][col];
                const x = col * TILE_SIZE;
                const y = row * TILE_SIZE;

                if (tile === "#") {
                    // Draw Wall
                    ctx.fillStyle = "rgb(0, 0, 255)";
                    ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
                } else if (tile === ".") {
                    // Draw Food
                    ctx.fillStyle = "rgb(255, 255, 255)";
                    ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

                    // Draw Inner Square
                    ctx.fillStyle = "rgb(0, 0, 0)";
                    const innerOffset = 13;
                    ctx.fillRect(
                        x + innerOffset,
                        y + innerOffset,
                        TILE_SIZE - innerOffset * 2,
                        TILE_SIZE - innerOffset * 2
                    );
                }
            }
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.clearRect(0, 0, WIDTH, HEIGHT); // Clear canvas
                drawMap(ctx); // Draw the map
            }
        }
    }, []);

    return (
        <div className="flex justify-center items-center h-screen bg-gray-900">
            <canvas
                ref={canvasRef}
                width={WIDTH}
                height={HEIGHT}
                className="border border-gray-500"
            ></canvas>
        </div>
    );
};

export default SnakeMap;
