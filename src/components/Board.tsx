import React from 'react';
import { BoardGrid, Piece } from '../types';
import { BOARD_HEIGHT, BOARD_WIDTH, TETROMINO_COLORS } from '../constants';

interface BoardProps {
  board: BoardGrid;
  currentPiece: Piece | null;
  ghostPiece: Piece | null;
  clearedRows: number[];
}

export const Board: React.FC<BoardProps> = ({
  board,
  currentPiece,
  ghostPiece,
  clearedRows,
}) => {
  // Create a display matrix to combine board, ghost piece, and active piece
  const displayMatrix: {
    type: string | null;
    isGhost: boolean;
    isActive: boolean;
    isClearing: boolean;
  }[][] = Array.from({ length: BOARD_HEIGHT }, (_, r) =>
    Array.from({ length: BOARD_WIDTH }, (_, c) => ({
      type: board[r][c],
      isGhost: false,
      isActive: false,
      isClearing: clearedRows.includes(r),
    }))
  );

  // Overlay Ghost Piece
  if (ghostPiece && currentPiece) {
    const { shape, x, y, type } = ghostPiece;
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c] !== 0) {
          const targetY = y + r;
          const targetX = x + c;
          if (
            targetY >= 0 &&
            targetY < BOARD_HEIGHT &&
            targetX >= 0 &&
            targetX < BOARD_WIDTH
          ) {
            // Only set if not already filled on base board
            if (displayMatrix[targetY][targetX].type === null) {
              displayMatrix[targetY][targetX] = {
                type,
                isGhost: true,
                isActive: false,
                isClearing: false,
              };
            }
          }
        }
      }
    }
  }

  // Overlay Active Falling Piece
  if (currentPiece) {
    const { shape, x, y, type } = currentPiece;
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c] !== 0) {
          const targetY = y + r;
          const targetX = x + c;
          if (
            targetY >= 0 &&
            targetY < BOARD_HEIGHT &&
            targetX >= 0 &&
            targetX < BOARD_WIDTH
          ) {
            displayMatrix[targetY][targetX] = {
              type,
              isGhost: false,
              isActive: true,
              isClearing: false,
            };
          }
        }
      }
    }
  }

  return (
    <div
      id="tetris-board-container"
      className="relative p-2.5 sm:p-3 bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.6)] inline-block select-none transition-all"
    >
      {/* Subtle atmospheric ambient glow behind board */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-transparent to-fuchsia-500/10 pointer-events-none" />

      {/* Tetris 10x20 Grid */}
      <div
        id="tetris-grid"
        className="relative z-10 grid grid-cols-10 gap-[1.5px] sm:gap-[2px] bg-black/50 backdrop-blur-sm p-1.5 sm:p-2 rounded-xl border border-white/10"
        style={{
          width: 'min(78vw, 320px)',
          aspectRatio: '10 / 20',
        }}
      >
        {displayMatrix.map((row, rIdx) =>
          row.map((cell, cIdx) => {
            const colorConfig = cell.type
              ? TETROMINO_COLORS[cell.type as keyof typeof TETROMINO_COLORS]
              : null;

            return (
              <div
                key={`${rIdx}-${cIdx}`}
                id={`cell-${rIdx}-${cIdx}`}
                className={`relative w-full h-full rounded-[2.5px] sm:rounded-[3px] transition-all duration-75 flex items-center justify-center ${
                  cell.isClearing
                    ? 'bg-white shadow-[0_0_25px_#ffffff] scale-95 opacity-95'
                    : cell.isActive && colorConfig
                    ? `${colorConfig.bg} ${colorConfig.glow} border border-white/40`
                    : cell.isGhost && colorConfig
                    ? `${colorConfig.ghostBg} border border-dashed ${colorConfig.ghostBorder}`
                    : cell.type && colorConfig
                    ? `${colorConfig.bg} ${colorConfig.glow} border border-white/30`
                    : 'bg-white/[0.02] border border-white/[0.05]'
                }`}
              >
                {/* 3D Inner Glass Highlight for solid blocks */}
                {(cell.isActive || (cell.type && !cell.isGhost)) && !cell.isClearing && (
                  <div className="absolute inset-[1.5px] rounded-[1.5px] bg-white/25 pointer-events-none" />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
