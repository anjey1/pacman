import React, { useRef, useEffect, useState } from "react";

const TILE_SIZE = 32;
const WIDTH = 740;
const HEIGHT = 780;

const MAP = [
    "#######################",
    "#A#.................#.#",
    "#.###.#####.#####.###.#",
    "#.........#.#.........#",
    "#.###.###.#.#.###.###.#",
    "#.#.#.#.#.#.#.#.#.#.#.#",
    "###.#.#.#.#.#.#.#.#.###",
    "#...#.#.###.###.#.#...#",
    "#.###.#.........#.###.#",
    "#.....#.#######.#H....#",
    "#.#####.#.....#.#####.#",
    "#A...................A#",
    "#.#####.#.....#.#####.#",
    "#....H#.#######.#.....#",
    "#.###.#.........#.###.#",
    "#.#.#.#.###.###.#.#.#.#",
    "#.#.#.#.#.#.#.#.#.#.#.#",
    "#...#.#.#.#.#.#.#.#...#",
    "###.#.#.#.#.#.#.#.#.###",
    "#.###.###.#.#.###.###.#",
    "#.........#.#.........#",
    "#.###.#####.#####.###.#",
    "#.#.................#A#",
    "#######################",
];

const SnakeMap: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);

    const drawMap = (ctx: CanvasRenderingContext2D) => {
        for (let row = 0; row < MAP.length; row++) {
            for (let col = 0; col < MAP[row].length; col++) {
                const tile = MAP[row][col];
                const x = col * TILE_SIZE;
                const y = row * TILE_SIZE;

                if (tile === "#") {
                    // Draw Wall
                    ctx.fillStyle = "rgb(28, 28, 102)";
                    ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

                } else if (tile === "." && images.length > 0) {
                    // Draw Food
                    const size = 10;
                    ctx.drawImage(images[0], x + 10, y + 10, size, size)

                    // Draw Inner Square
                    ctx.fillStyle = "rgba(255, 255, 255, 0)";
                    const innerOffset = 13;
                    ctx.fillRect(
                        x + innerOffset,
                        y + innerOffset,
                        TILE_SIZE - innerOffset * 2,
                        TILE_SIZE - innerOffset * 2
                    );
                } else if (tile === "A" && images.length > 0) {
                    // Draw Food
                    const size = 23;
                    ctx.drawImage(images[1], x + 5, y + 4, size, size)

                    // Draw Inner Square
                    ctx.fillStyle = "rgba(255, 255, 255, 0)";
                    const innerOffset = 13;
                    ctx.fillRect(
                        x + innerOffset,
                        y + innerOffset,
                        TILE_SIZE - innerOffset * 2,
                        TILE_SIZE - innerOffset * 2
                    );
                } else if (tile === "H" && images.length > 0) {
                    // Draw Food
                    const size = 23;
                    ctx.drawImage(images[2], x + 5, y + 4, size, size)

                    // Draw Inner Square
                    ctx.fillStyle = "rgba(255, 255, 255, 0)";
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
        if (canvas && images.length > 0) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.clearRect(0, 0, WIDTH, HEIGHT);
                drawMap(ctx);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [images]); // Redraw when images are loaded

    // Preload images and store them in state
    useEffect(() => {
        const loadedImages: HTMLImageElement[] = [];

        const imageSrc = [
            "/assets/food.png",
            "/assets/fruit.png",
            "/assets/life.png",
            "/assets/life_big.png",
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
                    console.log(loadedImages)
                }
            };

            img.onerror = () => {
                console.error(`Failed to load image: ${src}`);
            };
        });
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
