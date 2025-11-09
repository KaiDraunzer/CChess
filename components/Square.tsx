import React from 'react';
import Piece from './Piece';
import type { Piece as PieceInfo } from '../types';

interface SquareProps {
  isBlack: boolean;
  piece: PieceInfo | null;
  highlight: boolean;
  onClick: () => void;
}

const Square: React.FC<SquareProps> = ({ isBlack, piece, highlight, onClick }) => {
  const bgColor = isBlack ? 'bg-gray-500' : 'bg-gray-200';
  const highlightColor = 'bg-yellow-400';

  return (
    <div
      onClick={onClick}
      className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center cursor-pointer ${highlight ? highlightColor : bgColor}`}
    >
      {piece && <Piece type={piece.type} color={piece.color} />}
    </div>
  );
};

export default Square;
