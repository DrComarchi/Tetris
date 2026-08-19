import React from 'react';
import { TetrominoType } from '../types';
import { TETROMINO_COLORS, TETROMINO_SHAPES } from '../constants';

interface PiecePreviewProps {
  type: TetrominoType | null;
  size?: 'sm' | 'md';
  disabled?: boolean;
}

export const PiecePreview: React.FC<PiecePreviewProps> = ({
  type,
  size = 'md',
  disabled = false,
}) => {
  if (!type) {
    return (
      <div
        className={`flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/10 ${
          size === 'sm' ? 'w-14 h-14' : 'w-24 h-24'
        }`}
      >
        <span className="text-xs text-white/20 font-mono">-</span>
      </div>
    );
  }

  const shape = TETROMINO_SHAPES[type];
  const color = TETROMINO_COLORS[type];
  const rows = shape.length;
  const cols = shape[0].length;

  return (
    <div
      className={`flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/10 p-2 transition-all ${
        disabled ? 'opacity-30' : 'opacity-100'
      } ${size === 'sm' ? 'w-14 h-14' : 'w-24 h-24'}`}
    >
      <div
        className="grid gap-[2px]"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        }}
      >
        {shape.map((row, rIdx) =>
          row.map((cell, cIdx) => (
            <div
              key={`${rIdx}-${cIdx}`}
              className={`rounded-[2px] ${
                size === 'sm' ? 'w-2.5 h-2.5' : 'w-4 h-4 sm:w-4.5 sm:h-4.5'
              } ${
                cell === 1
                  ? `${color.bg} ${color.glow} border border-white/30`
                  : 'bg-transparent'
              }`}
            />
          ))
        )}
      </div>
    </div>
  );
};
