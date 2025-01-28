interface GameOverDialogProps {
    gameOver: boolean;
}

const GameOverDialog: React.FC<GameOverDialogProps> = ({ gameOver }) => {
    if (!gameOver) return null; // Don't render anything if gameOver is false

    return (
        <div class="dialog-overlay">
            <div class="dialog-box">
                <h2>Nice Try. Try Harder</h2>
            </div>
        </div>
    );
};

export default GameOverDialog;