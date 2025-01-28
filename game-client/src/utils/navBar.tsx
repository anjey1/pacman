import React from 'react';
import { FaHeart } from 'react-icons/fa'; // Heart icons

interface NavbarProps {
    score: number;
}

const Navbar: React.FC<NavbarProps> = ({ score }) => {
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
                {/* Heart Icons */}
                <div className="heart-container">
                    <FaHeart className="heart-icon" />
                    <FaHeart className="heart-icon" />
                    <FaHeart className="heart-icon" />
                </div>

                {/* Score */}
                <div className="score-container">
                    <p>Score: {score}</p>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
