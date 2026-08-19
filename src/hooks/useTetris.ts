import { useState, useEffect, useCallback, useRef } from 'react';
import {
  BoardGrid,
  GameStats,
  GameStatus,
  Piece,
  Position,
  TetrominoType,
} from '../types';
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  HARD_DROP_POINTS,
  LINE_POINTS,
  SOFT_DROP_POINTS,
  STORAGE_KEY_HIGH_SCORE,
  STORAGE_KEY_SOUND,
  TETROMINO_SHAPES,
  getDropInterval,
} from '../constants';
import { sound } from '../audio';

const createEmptyBoard = (): BoardGrid => {
  return Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(null));
};

const TETROMINO_TYPES: TetrominoType[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];

// 7-Bag Randomizer
const generateBag = (): TetrominoType[] => {
  const bag = [...TETROMINO_TYPES];
  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }
  return bag;
};

export function useTetris() {
  const [board, setBoard] = useState<BoardGrid>(createEmptyBoard);
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null);
  const [holdPiece, setHoldPiece] = useState<TetrominoType | null>(null);
  const [canHold, setCanHold] = useState<boolean>(true);
  const [nextPieces, setNextPieces] = useState<TetrominoType[]>([]);
  const [bag, setBag] = useState<TetrominoType[]>([]);
  const [status, setStatus] = useState<GameStatus>('idle');
  const [clearedRows, setClearedRows] = useState<number[]>([]);
  const [combo, setCombo] = useState<number>(0);
  const [soundMuted, setSoundMuted] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEY_SOUND) === 'true';
    }
    return false;
  });

  const [stats, setStats] = useState<GameStats>(() => {
    let savedHighScore = 0;
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_HIGH_SCORE);
      if (saved) savedHighScore = parseInt(saved, 10) || 0;
    }
    return {
      score: 0,
      highScore: savedHighScore,
      lines: 0,
      level: 1,
      combos: 0,
      lastClearCount: 0,
    };
  });

  const bagRef = useRef<TetrominoType[]>([]);
  bagRef.current = bag;

  // Initialize sound mute state
  useEffect(() => {
    sound.setMuted(soundMuted);
    localStorage.setItem(STORAGE_KEY_SOUND, String(soundMuted));
  }, [soundMuted]);

  const toggleSound = useCallback(() => {
    setSoundMuted((prev) => !prev);
  }, []);

  // Helper to draw from bag
  const getNextPieceType = useCallback((): TetrominoType => {
    let currentBag = [...bagRef.current];
    if (currentBag.length === 0) {
      currentBag = generateBag();
    }
    const nextType = currentBag.shift()!;
    if (currentBag.length < 5) {
      currentBag = [...currentBag, ...generateBag()];
    }
    bagRef.current = currentBag;
    setBag(currentBag);
    return nextType;
  }, []);

  const createNewPiece = useCallback((type: TetrominoType): Piece => {
    const shape = TETROMINO_SHAPES[type].map((row) => [...row]);
    const width = shape[0].length;
    return {
      type,
      shape,
      x: Math.floor((BOARD_WIDTH - width) / 2),
      y: 0,
    };
  }, []);

  // Check Collision
  const checkCollision = useCallback(
    (piece: Piece, testBoard: BoardGrid, offsetX = 0, offsetY = 0): boolean => {
      const { shape, x, y } = piece;
      for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
          if (shape[r][c] !== 0) {
            const targetX = x + c + offsetX;
            const targetY = y + r + offsetY;

            // Boundaries
            if (targetX < 0 || targetX >= BOARD_WIDTH || targetY >= BOARD_HEIGHT) {
              return true;
            }

            // Board filled cells (ignore top before entering)
            if (targetY >= 0 && testBoard[targetY][targetX] !== null) {
              return true;
            }
          }
        }
      }
      return false;
    },
    []
  );

  // Compute Ghost Piece
  const getGhostPiece = useCallback((): Piece | null => {
    if (!currentPiece) return null;
    let dropY = 0;
    while (!checkCollision(currentPiece, board, 0, dropY + 1)) {
      dropY++;
    }
    return {
      ...currentPiece,
      y: currentPiece.y + dropY,
    };
  }, [currentPiece, board, checkCollision]);

  // Lock piece, clear lines, and spawn next
  const lockPiece = useCallback(
    (pieceToLock: Piece) => {
      const newBoard = board.map((row) => [...row]);
      const { shape, x, y, type } = pieceToLock;

      // Place cells on the board
      for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
          if (shape[r][c] !== 0) {
            const targetY = y + r;
            const targetX = x + c;
            if (targetY >= 0 && targetY < BOARD_HEIGHT && targetX >= 0 && targetX < BOARD_WIDTH) {
              newBoard[targetY][targetX] = type;
            }
          }
        }
      }

      // Check for completed rows
      const fullRowIndices: number[] = [];
      for (let r = 0; r < BOARD_HEIGHT; r++) {
        if (newBoard[r].every((cell) => cell !== null)) {
          fullRowIndices.push(r);
        }
      }

      if (fullRowIndices.length > 0) {
        setClearedRows(fullRowIndices);
        sound.playLineClear(fullRowIndices.length);

        // Flash animation delay
        setTimeout(() => {
          const clearedBoard = newBoard.filter((_, idx) => !fullRowIndices.includes(idx));
          const emptyRows = Array.from({ length: fullRowIndices.length }, () =>
            Array(BOARD_WIDTH).fill(null)
          );
          const finalBoard = [...emptyRows, ...clearedBoard];
          setBoard(finalBoard);
          setClearedRows([]);

          // Update Score, Lines, Level
          const linesCleared = fullRowIndices.length;
          const basePoints = LINE_POINTS[linesCleared] || 0;
          const newCombo = combo + 1;
          const comboBonus = newCombo > 1 ? (newCombo - 1) * 50 * stats.level : 0;
          const pointsEarned = basePoints * stats.level + comboBonus;

          setCombo(newCombo);
          setStats((prev) => {
            const totalLines = prev.lines + linesCleared;
            const newLevel = Math.floor(totalLines / 10) + 1;
            if (newLevel > prev.level) {
              sound.playLevelUp();
            }
            const newScore = prev.score + pointsEarned;
            const newHigh = Math.max(prev.highScore, newScore);
            if (newHigh > prev.highScore) {
              localStorage.setItem(STORAGE_KEY_HIGH_SCORE, String(newHigh));
            }
            return {
              ...prev,
              score: newScore,
              highScore: newHigh,
              lines: totalLines,
              level: newLevel,
              combos: newCombo,
              lastClearCount: linesCleared,
            };
          });

          // Spawn next piece
          spawnNextPiece(finalBoard);
        }, 180);
      } else {
        setCombo(0);
        sound.playDrop();
        setBoard(newBoard);
        spawnNextPiece(newBoard);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [board, combo, stats.level, stats.highScore]
  );

  // Spawn Next Piece
  const spawnNextPiece = useCallback(
    (currentBoard: BoardGrid) => {
      let queue = [...nextPieces];
      while (queue.length < 4) {
        queue.push(getNextPieceType());
      }
      const nextType = queue.shift()!;
      setNextPieces(queue);

      const piece = createNewPiece(nextType);

      // Check if game over
      if (checkCollision(piece, currentBoard, 0, 0)) {
        setStatus('gameover');
        sound.playGameOver();
        setCurrentPiece(null);
      } else {
        setCurrentPiece(piece);
        setCanHold(true);
      }
    },
    [nextPieces, getNextPieceType, createNewPiece, checkCollision]
  );

  // Rotate Piece with Wall Kick
  const rotatePiece = useCallback(
    (direction: 'CW' | 'CCW' = 'CW') => {
      if (!currentPiece || status !== 'playing') return;

      const { shape, type } = currentPiece;
      if (type === 'O') return; // O piece doesn't need rotation

      const N = shape.length;
      const newShape: number[][] = Array.from({ length: N }, () => Array(N).fill(0));

      for (let r = 0; r < N; r++) {
        for (let c = 0; c < N; c++) {
          if (direction === 'CW') {
            newShape[c][N - 1 - r] = shape[r][c];
          } else {
            newShape[N - 1 - c][r] = shape[r][c];
          }
        }
      }

      // Standard kick offsets to test: [0, 0], [-1, 0], [1, 0], [-2, 0], [2, 0], [0, -1]
      const kickOffsets = [
        { x: 0, y: 0 },
        { x: -1, y: 0 },
        { x: 1, y: 0 },
        { x: -2, y: 0 },
        { x: 2, y: 0 },
        { x: 0, y: -1 },
      ];

      for (const offset of kickOffsets) {
        const testPiece: Piece = {
          ...currentPiece,
          shape: newShape,
          x: currentPiece.x + offset.x,
          y: currentPiece.y + offset.y,
        };

        if (!checkCollision(testPiece, board)) {
          setCurrentPiece(testPiece);
          sound.playRotate();
          return;
        }
      }
    },
    [currentPiece, status, board, checkCollision]
  );

  // Move Piece Horizontally
  const movePiece = useCallback(
    (dirX: number) => {
      if (!currentPiece || status !== 'playing') return;
      if (!checkCollision(currentPiece, board, dirX, 0)) {
        setCurrentPiece((prev) => (prev ? { ...prev, x: prev.x + dirX } : null));
        sound.playMove();
      }
    },
    [currentPiece, status, board, checkCollision]
  );

  // Soft Drop
  const softDrop = useCallback(() => {
    if (!currentPiece || status !== 'playing') return;
    if (!checkCollision(currentPiece, board, 0, 1)) {
      setCurrentPiece((prev) => (prev ? { ...prev, y: prev.y + 1 } : null));
      setStats((prev) => ({
        ...prev,
        score: prev.score + SOFT_DROP_POINTS,
      }));
    } else {
      lockPiece(currentPiece);
    }
  }, [currentPiece, status, board, checkCollision, lockPiece]);

  // Hard Drop
  const hardDrop = useCallback(() => {
    if (!currentPiece || status !== 'playing') return;
    let dropDistance = 0;
    while (!checkCollision(currentPiece, board, 0, dropDistance + 1)) {
      dropDistance++;
    }

    const lockedPiece: Piece = {
      ...currentPiece,
      y: currentPiece.y + dropDistance,
    };

    setStats((prev) => ({
      ...prev,
      score: prev.score + dropDistance * HARD_DROP_POINTS,
    }));

    sound.playHardDrop();
    lockPiece(lockedPiece);
  }, [currentPiece, status, board, checkCollision, lockPiece]);

  // Hold Piece
  const hold = useCallback(() => {
    if (!currentPiece || !canHold || status !== 'playing') return;

    sound.playHold();
    setCanHold(false);

    const currentType = currentPiece.type;

    if (holdPiece === null) {
      setHoldPiece(currentType);
      // Spawn next piece from queue
      let queue = [...nextPieces];
      while (queue.length < 4) {
        queue.push(getNextPieceType());
      }
      const nextType = queue.shift()!;
      setNextPieces(queue);
      const piece = createNewPiece(nextType);
      setCurrentPiece(piece);
    } else {
      const prevHold = holdPiece;
      setHoldPiece(currentType);
      const piece = createNewPiece(prevHold);
      setCurrentPiece(piece);
    }
  }, [currentPiece, canHold, status, holdPiece, nextPieces, getNextPieceType, createNewPiece]);

  // Start / Restart Game
  const startGame = useCallback(() => {
    const freshBag = generateBag();
    bagRef.current = freshBag;
    const initialPieceType = freshBag.shift()!;
    const queue: TetrominoType[] = [];
    while (queue.length < 4) {
      if (freshBag.length === 0) {
        freshBag.push(...generateBag());
      }
      queue.push(freshBag.shift()!);
    }

    setBag(freshBag);
    setBoard(createEmptyBoard());
    setHoldPiece(null);
    setCanHold(true);
    setNextPieces(queue);
    setCombo(0);
    setClearedRows([]);

    const piece = createNewPiece(initialPieceType);
    setCurrentPiece(piece);
    setStatus('playing');

    setStats((prev) => ({
      score: 0,
      highScore: prev.highScore,
      lines: 0,
      level: 1,
      combos: 0,
      lastClearCount: 0,
    }));
  }, [createNewPiece]);

  // Pause / Resume
  const pauseGame = useCallback(() => {
    if (status === 'playing') {
      setStatus('paused');
    } else if (status === 'paused') {
      setStatus('playing');
    }
  }, [status]);

  // Game Loop Ticker
  useEffect(() => {
    if (status !== 'playing' || !currentPiece || clearedRows.length > 0) return;

    const intervalTime = getDropInterval(stats.level);
    const timer = setInterval(() => {
      if (!checkCollision(currentPiece, board, 0, 1)) {
        setCurrentPiece((prev) => (prev ? { ...prev, y: prev.y + 1 } : null));
      } else {
        lockPiece(currentPiece);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [status, currentPiece, board, stats.level, clearedRows, checkCollision, lockPiece]);

  return {
    board,
    currentPiece,
    ghostPiece: getGhostPiece(),
    holdPiece,
    canHold,
    nextPieces,
    status,
    stats,
    clearedRows,
    soundMuted,
    toggleSound,
    movePiece,
    rotatePiece,
    softDrop,
    hardDrop,
    hold,
    startGame,
    pauseGame,
  };
}
