import React, { useEffect, useState } from 'react';
import { getPieceSvg } from '../constants';
import { PieceColor } from '../types';

interface FlyingKingProps {
  from: { row: number; col: number };
  to: { row: number; col: number };
  color: PieceColor;
  isFlipped: boolean;
}

// This utility function helps determine the square size based on viewport width,
// matching the Tailwind CSS responsive breakpoints.
const getSquareSize = () => {
    if (typeof window === 'undefined') return 96; // Default for server-side rendering
    if (window.matchMedia('(min-width: 768px)').matches) return 96; // md:w-24 -> 6rem -> 96px
    if (window.matchMedia('(min-width: 640px)').matches) return 80; // sm:w-20 -> 5rem -> 80px
    return 64; // w-16 -> 4rem -> 64px
};

const FlyingKing: React.FC<FlyingKingProps> = ({ from, to, color, isFlipped }) => {
    const [style, setStyle] = useState<React.CSSProperties>({});
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const squareSize = getSquareSize();

        const fromRow = isFlipped ? 7 - from.row : from.row;
        const fromCol = isFlipped ? 7 - from.col : from.col;
        const toRow = isFlipped ? 7 - to.row : to.row;
        const toCol = isFlipped ? 7 - to.col : to.col;

        const startStyle: React.CSSProperties = {
            position: 'absolute',
            top: `${fromRow * squareSize}px`,
            left: `${fromCol * squareSize}px`,
            width: `${squareSize}px`,
            height: `${squareSize}px`,
            zIndex: 50,
            transition: 'all 1s ease-in-out',
            transform: 'scale(1)',
        };
        setStyle(startStyle);
        setIsVisible(true);

        // Defer the animation start to allow the component to mount with initial styles
        const timeoutId = setTimeout(() => {
            setStyle({
                ...startStyle,
                top: `${toRow * squareSize}px`,
                left: `${toCol * squareSize}px`,
                transform: 'scale(1.5) rotate(360deg)',
            });
        }, 50); // Small delay to ensure transition is applied

        return () => clearTimeout(timeoutId);
    }, [from, to, color, isFlipped]);

    if (!isVisible) return null;

    return (
        <div style={style}>
            {getPieceSvg({ type: 'k', color })}
        </div>
    );
};

export default FlyingKing;
