import React from 'react';

interface GameOverDialogProps {
  message: string;
  onPlayAgain: () => void;
}

const GameOverDialog: React.FC<GameOverDialogProps> = ({ message, onPlayAgain }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gray-700 p-8 rounded-lg shadow-xl text-center">
        <h2 className="text-3xl font-bold mb-4 text-yellow-400">{message}</h2>
        <button
          className="px-8 py-3 rounded bg-green-600 hover:bg-green-500 text-white font-bold text-lg transition-colors"
          onClick={onPlayAgain}
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

export default GameOverDialog;