import React, { useState, useEffect, useCallback } from 'react';
// @ts-ignore
import { Chess, Square as ChessSquare } from 'chess.js';
import Board from './components/Board';
import PromotionDialog from './components/PromotionDialog';
import FlyingKing from './components/FlyingKing';
import GameOverDialog from './components/GameOverDialog';
import type { Piece, PieceType, PieceColor } from './types';

// A type guard to narrow the chess.js PieceType
function isPieceType(type: string): type is PieceType {
    return ['p', 'r', 'n', 'b', 'q', 'k'].includes(type);
}

const App: React.FC = () => {
    const [game, setGame] = useState(() => new Chess());
    const [board, setBoard] = useState<(Piece | null)[][]>([]);
    const [selectedSquare, setSelectedSquare] = useState<{ row: number, col: number } | null>(null);
    const [validMoves, setValidMoves] = useState<string[]>([]);
    const [gameOver, setGameOver] = useState('');
    const [isFlipped, setIsFlipped] = useState(false);
    const [promotionMove, setPromotionMove] = useState<{ from: string, to: string } | null>(null);
    const [regicideAnimation, setRegicideAnimation] = useState<{ from: { row: number, col: number }, to: { row: number, col: number }, color: PieceColor } | null>(null);

    const updateBoard = useCallback(() => {
        const boardFromGame = game.board();
        const newBoard = boardFromGame.map(row => 
            row.map(piece => {
                if (piece && isPieceType(piece.type)) {
                    return { type: piece.type, color: piece.color as PieceColor };
                }
                return null;
            })
        );
        setBoard(newBoard);
    }, [game]);

    const checkGameOver = useCallback(() => {
        if (game.isGameOver()) {
            if (game.isCheckmate()) {
                const winnerColor = game.turn() === 'w' ? 'b' : 'w';
                setGameOver(`Checkmate! ${winnerColor === 'w' ? 'White' : 'Black'} wins.`);
            } else if (game.isStalemate()) {
                setGameOver('Stalemate!');
            } else if (game.isDraw()) {
                setGameOver('Draw!');
            }
            return true;
        }
        setGameOver('');
        return false;
    }, [game]);

    useEffect(() => {
        updateBoard();
        checkGameOver();
    }, [game, updateBoard, checkGameOver]);

    const handleSquareClick = (row: number, col: number) => {
        if (gameOver || regicideAnimation) return;

        const square = String.fromCharCode('a'.charCodeAt(0) + col) + (8 - row) as ChessSquare;

        if (selectedSquare) {
            const fromSquare = String.fromCharCode('a'.charCodeAt(0) + selectedSquare.col) + (8 - selectedSquare.row) as ChessSquare;
            const toSquare = square;
            
            const fromPiece = game.get(fromSquare);
            const toPiece = game.get(toSquare);
            
            // REGICIDE: King on King click
            if (fromPiece?.type === 'k' && toPiece?.type === 'k' && fromPiece.color !== toPiece.color) {
                setRegicideAnimation({
                    from: { row: selectedSquare.row, col: selectedSquare.col },
                    to: { row, col },
                    color: fromPiece.color as PieceColor,
                });
                
                // Set game over after animation
                setTimeout(() => {
                    setGameOver(`Regicide! ${fromPiece.color === 'w' ? 'White' : 'Black'} wins.`);
                }, 1000); // Corresponds to animation duration in FlyingKing

                setSelectedSquare(null);
                setValidMoves([]);
                return; // End turn, skipping normal move logic
            }

            // Check for promotion
            if (fromPiece?.type === 'p' && (toSquare[1] === '8' || toSquare[1] === '1')) {
                const moves = game.moves({ square: fromSquare, verbose: true });
                if (moves.some(m => m.to === toSquare && m.promotion)) {
                    setPromotionMove({ from: fromSquare, to: toSquare });
                    return; // Wait for promotion selection
                }
            }
            
            const gameCopy = new Chess(game.fen());
            const moveResult = gameCopy.move({ from: fromSquare, to: toSquare });

            if (moveResult) {
                setGame(gameCopy);
            }
            // Always deselect after a move attempt
            setSelectedSquare(null);
            setValidMoves([]);

        } else {
            const piece = game.get(square);
            if (piece && piece.color === game.turn()) {
                selectPiece(row, col, square);
            }
        }
    };
    
    const selectPiece = (row: number, col: number, square: ChessSquare) => {
        setSelectedSquare({ row, col });
        const moves = game.moves({ square, verbose: true });
        setValidMoves(moves.map(m => m.to));
    };

    const handlePromotionSelect = (pieceType: PieceType) => {
        if (promotionMove) {
            const gameCopy = new Chess(game.fen());
            gameCopy.move({ from: promotionMove.from, to: promotionMove.to, promotion: pieceType });
            setGame(gameCopy);
            
            setPromotionMove(null);
            setSelectedSquare(null);
            setValidMoves([]);
        }
    };

    const handleNewGame = () => {
        setGame(new Chess());
        setGameOver('');
        setSelectedSquare(null);
        setValidMoves([]);
        setPromotionMove(null);
        setRegicideAnimation(null);
        setIsFlipped(false);
    };

    return (
        <div className="min-h-screen bg-gray-800 text-white flex flex-col items-center justify-center p-4 font-sans">
            <div className="flex flex-col items-center">
                <h1 className="text-4xl font-bold mb-4">Offline Chess</h1>
                
                <div className="relative"> {/* Positioning context for FlyingKing */}
                    <Board
                        board={board}
                        onSquareClick={handleSquareClick}
                        selectedSquare={selectedSquare}
                        validMovesForSelectedPiece={validMoves}
                        isFlipped={isFlipped}
                        hidePieceAtSquare={regicideAnimation ? regicideAnimation.from : null}
                    />
                    {regicideAnimation && (
                        <FlyingKing 
                            from={regicideAnimation.from}
                            to={regicideAnimation.to}
                            color={regicideAnimation.color}
                            isFlipped={isFlipped}
                        />
                    )}
                </div>

                <div className="mt-4 text-lg text-center h-12 flex items-center justify-center w-full max-w-md">
                    {!gameOver && (
                         <p className="text-xl">{game.turn() === 'w' ? "White's" : "Black's"} turn</p>
                    )}
                </div>
                
                <div className="flex space-x-4 mt-2">
                    <button
                        className="px-6 py-2 rounded bg-blue-600 hover:bg-blue-500 transition-colors"
                        onClick={handleNewGame}
                    >
                        New Game
                    </button>
                    <button
                        className="px-6 py-2 rounded bg-gray-600 hover:bg-gray-500 transition-colors"
                        onClick={() => setIsFlipped(!isFlipped)}
                    >
                        Flip Board
                    </button>
                </div>

                {promotionMove && (
                    <PromotionDialog color={game.turn()} onSelect={handlePromotionSelect} />
                )}
                {gameOver && (
                    <GameOverDialog message={gameOver} onPlayAgain={handleNewGame} />
                )}
            </div>
        </div>
    );
};

export default App;