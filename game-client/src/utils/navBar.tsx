import React, { useEffect, useState } from 'react';

interface NavbarProps {
    score: number;
    life: number;
}

const Navbar: React.FC<NavbarProps> = ({ score, life }) => {

    const [heartImage, setHeartImage] = useState<string | null>(null);

    // Preload the heart image
    useEffect(() => {
        const img = new Image();
        img.src = "/assets/life_big.png"; // Replace with the correct path
        img.onload = () => setHeartImage(img.src); // Store the loaded image URL
        img.onerror = () => console.error("Failed to load heart image");
    }, []);

    return (
        <div className="navbar">
            {/* Left side - PAC-MAN text */}
            <div className="pixel-text">
                <span className="pacman-p">P</span>
                <span className="pacman-a">A</span>
                <span className="pacman-c">C</span>
                <span className="pacman-dash">-</span>
                <span className="pacman-m">M</span>
                <span className="pacman-a2">A</span>
                <span className="pacman-n">N</span>
            </div>

            {/* Right side - Heart icons and score */}
            <div className="flex items-center">
                {/* Score */}
                <div className="score-container pixel-text">
                    <p>Score: {score}</p>
                </div>

                {/* Render hearts dynamically based on 'life' */}
                <div className="heart-container flex">
                    {[...Array(life)].map((_, index) => (
                        <img
                            key={index}
                            src={heartImage}
                            alt="Heart"
                            className="heart-icon w-5 h-5 mr-1" // Adjust width, height, and margin as needed
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
