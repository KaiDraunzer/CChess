import React from 'react';
import Square from './Square';
import type { Piece } from '../types';

interface BoardProps {
  board: (Piece | null)[][];
  onSquareClick: (row: number, col: number) => void;
  selectedSquare: { row: number, col: number } | null;
  validMovesForSelectedPiece: string[]; // e.g. ['e4', 'f3']
  isFlipped: boolean;
  hidePieceAtSquare: { row: number, col: number } | null;
}

const Board: React.FC<BoardProps> = ({ board, onSquareClick, selectedSquare, validMovesForSelectedPiece, isFlipped, hidePieceAtSquare }) => {
  const boardToRender = isFlipped ? [...board].reverse().map(row => [...row].reverse()) : board;

  const getSquareNotation = (row: number, col: number) => {
    const file = String.fromCharCode('a'.charCodeAt(0) + col);
    const rank = 8 - row;
    return `${file}${rank}`;
  };

  return (
    <div className="grid grid-cols-8 border-4 border-gray-700">
      {boardToRender.map((row, rowIndex) =>
        row.map((piece, colIndex) => {
          const originalRow = isFlipped ? 7 - rowIndex : rowIndex;
          const originalCol = isFlipped ? 7 - colIndex : colIndex;
          
          const squareNotation = getSquareNotation(originalRow, originalCol);
          
          const isBlack = (originalRow + originalCol) % 2 === 1;
          const isSelected = selectedSquare?.row === originalRow && selectedSquare?.col === originalCol;
          const isMoveTarget = validMovesForSelectedPiece.includes(squareNotation);
          const highlight = isSelected || isMoveTarget;

          const shouldHide = hidePieceAtSquare?.row === originalRow && hidePieceAtSquare?.col === originalCol;

          return (
            <Square
              key={`${originalRow}-${originalCol}`}
              isBlack={isBlack}
              piece={shouldHide ? null : piece}
              highlight={highlight}
              onClick={() => onSquareClick(originalRow, originalCol)}
            />
          );
        })
      )}
    </div>
  );
};

export default Board;
