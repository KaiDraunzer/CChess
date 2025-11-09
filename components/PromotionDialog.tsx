import React from 'react';
import { PieceType, PieceColor } from '../types';
import { getPieceSvg } from '../constants';

interface PromotionDialogProps {
  color: PieceColor;
  onSelect: (pieceType: PieceType) => void;
}

const PromotionDialog: React.FC<PromotionDialogProps> = ({ color, onSelect }) => {
  const promotionPieces: PieceType[] = ['q', 'r', 'b', 'n'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg">
        <h3 className="text-lg font-bold mb-4 text-center text-black">Promote Pawn to:</h3>
        <div className="flex space-x-2">
          {promotionPieces.map((pieceType) => (
            <div
              key={pieceType}
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 cursor-pointer hover:bg-yellow-200 p-2 rounded"
              onClick={() => onSelect(pieceType)}
            >
              {getPieceSvg({ type: pieceType, color })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromotionDialog;
