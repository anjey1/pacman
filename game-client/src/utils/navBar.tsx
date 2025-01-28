import React from 'react';
import { FaHeart } from 'react-icons/fa'; // Heart icons

interface NavbarProps {
    score: number;
    life: number;
}

const Navbar: React.FC<NavbarProps> = ({ score, life }) => {
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
                        <FaHeart key={index} className="heart-icon text-red-500 mr-1" />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
