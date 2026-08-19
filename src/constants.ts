import { TetrominoType } from './types';

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

export const TETROMINO_SHAPES: Record<TetrominoType, number[][]> = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
};

export const TETROMINO_COLORS: Record<
  TetrominoType,
  {
    bg: string;
    border: string;
    glow: string;
    ghostBg: string;
    ghostBorder: string;
    name: string;
  }
> = {
  I: {
    bg: 'bg-cyan-400',
    border: 'border-cyan-200/60',
    glow: 'shadow-[0_0_15px_rgba(34,211,238,0.6)]',
    ghostBg: 'bg-cyan-400/15',
    ghostBorder: 'border-cyan-400/40',
    name: 'Cyan (I)',
  },
  J: {
    bg: 'bg-blue-500',
    border: 'border-blue-300/60',
    glow: 'shadow-[0_0_15px_rgba(59,130,246,0.6)]',
    ghostBg: 'bg-blue-500/15',
    ghostBorder: 'border-blue-400/40',
    name: 'Blue (J)',
  },
  L: {
    bg: 'bg-amber-500',
    border: 'border-amber-200/60',
    glow: 'shadow-[0_0_15px_rgba(245,158,11,0.6)]',
    ghostBg: 'bg-amber-500/15',
    ghostBorder: 'border-amber-400/40',
    name: 'Orange (L)',
  },
  O: {
    bg: 'bg-yellow-400',
    border: 'border-yellow-200/70',
    glow: 'shadow-[inset_0_0_8px_rgba(0,0,0,0.25),0_0_15px_rgba(250,204,21,0.6)]',
    ghostBg: 'bg-yellow-400/15',
    ghostBorder: 'border-yellow-300/40',
    name: 'Yellow (O)',
  },
  S: {
    bg: 'bg-emerald-500',
    border: 'border-emerald-200/60',
    glow: 'shadow-[0_0_15px_rgba(16,185,129,0.6)]',
    ghostBg: 'bg-emerald-500/15',
    ghostBorder: 'border-emerald-400/40',
    name: 'Green (S)',
  },
  T: {
    bg: 'bg-purple-500',
    border: 'border-purple-200/60',
    glow: 'shadow-[0_0_15px_rgba(168,85,247,0.6)]',
    ghostBg: 'bg-purple-500/15',
    ghostBorder: 'border-purple-400/40',
    name: 'Purple (T)',
  },
  Z: {
    bg: 'bg-rose-500',
    border: 'border-rose-200/60',
    glow: 'shadow-[0_0_15px_rgba(244,63,94,0.6)]',
    ghostBg: 'bg-rose-500/15',
    ghostBorder: 'border-rose-400/40',
    name: 'Red (Z)',
  },
};

export const LINE_POINTS = [0, 100, 300, 500, 800]; // 0, 1, 2, 3, 4 lines
export const SOFT_DROP_POINTS = 1;
export const HARD_DROP_POINTS = 2;

// Speed formula based on level (in ms per frame/tick)
export const getDropInterval = (level: number): number => {
  // Classic NES / modern hybrid curve
  const base = Math.max(80, 800 - (level - 1) * 70);
  return base;
};

export const STORAGE_KEY_HIGH_SCORE = 'tetris_classic_highscore';
export const STORAGE_KEY_SOUND = 'tetris_classic_sound';
