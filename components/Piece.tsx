
import React from 'react';
import { getPieceSvg } from '../constants';
import type { PieceType, PieceColor } from '../types';

interface PieceProps {
  type: PieceType;
  color: PieceColor;
}

const Piece: React.FC<PieceProps> = ({ type, color }) => {
  return (
    <div className="w-full h-full flex items-center justify-center cursor-grab">
      {getPieceSvg({ type, color })}
    </div>
  );
};

export default Piece;
