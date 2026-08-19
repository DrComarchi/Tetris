export type TetrominoType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';

export type CellValue = TetrominoType | null;

export type BoardGrid = CellValue[][];

export interface Position {
  x: number;
  y: number;
}

export interface Piece {
  type: TetrominoType;
  shape: number[][];
  x: number;
  y: number;
}

export type GameStatus = 'idle' | 'playing' | 'paused' | 'gameover';

export interface GameStats {
  score: number;
  highScore: number;
  lines: number;
  level: number;
  combos: number;
  lastClearCount: number;
}

export interface SoundSettings {
  muted: boolean;
  volume: number;
}
