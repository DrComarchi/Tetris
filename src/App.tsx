/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useCallback } from 'react';
import { useTetris } from './hooks/useTetris';
import { Board } from './components/Board';
import { PiecePreview } from './components/PiecePreview';
import { ScorePanel } from './components/ScorePanel';
import { ControlsGuide } from './components/ControlsGuide';
import { MobileControls } from './components/MobileControls';
import { GameOverModal } from './components/GameOverModal';
import { PauseModal } from './components/PauseModal';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Gamepad2,
  BookmarkCheck,
  ListOrdered,
} from 'lucide-react';

export default function App() {
  const {
    board,
    currentPiece,
    ghostPiece,
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
  } = useTetris();

  // Keyboard Event Listener
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't capture keys if typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // If game is not started or game over
      if (status === 'idle') {
        if (e.code === 'Space' || e.code === 'Enter') {
          e.preventDefault();
          startGame();
        }
        return;
      }

      if (status === 'gameover') {
        if (e.code === 'Space' || e.code === 'Enter' || e.key.toLowerCase() === 'r') {
          e.preventDefault();
          startGame();
        }
        return;
      }

      // Global controls: Pause
      if (e.key.toLowerCase() === 'p' || e.code === 'Escape') {
        e.preventDefault();
        pauseGame();
        return;
      }

      // Restart key
      if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        startGame();
        return;
      }

      // In-game controls (only when active playing)
      if (status !== 'playing') return;

      switch (e.code) {
        case 'ArrowLeft':
        case 'KeyA':
          e.preventDefault();
          movePiece(-1);
          break;
        case 'ArrowRight':
        case 'KeyD':
          e.preventDefault();
          movePiece(1);
          break;
        case 'ArrowUp':
        case 'KeyW':
        case 'KeyX':
          e.preventDefault();
          rotatePiece('CW');
          break;
        case 'KeyZ':
          e.preventDefault();
          rotatePiece('CCW');
          break;
        case 'ArrowDown':
        case 'KeyS':
          e.preventDefault();
          softDrop();
          break;
        case 'Space':
          e.preventDefault();
          hardDrop();
          break;
        case 'KeyC':
        case 'ShiftLeft':
        case 'ShiftRight':
          e.preventDefault();
          hold();
          break;
        default:
          break;
      }
    },
    [status, startGame, pauseGame, movePiece, rotatePiece, softDrop, hardDrop, hold]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <main className="relative min-h-screen bg-[#0a0a1a] text-white flex flex-col items-center justify-between p-3 sm:p-6 select-none font-sans overflow-x-hidden">
      {/* Frosted Glass Background Gradients & Glow Orbs */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-950/60 via-[#0a0a1a] to-fuchsia-950/50 pointer-events-none" />
      <div className="fixed top-[-10%] left-[-10%] w-[45%] h-[45%] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Frosted Glass Header */}
      <header
        id="app-header"
        className="relative z-10 w-full max-w-4xl flex items-center justify-between py-3 px-4 sm:px-6 mb-3 sm:mb-5 border border-white/10 backdrop-blur-xl bg-white/5 rounded-2xl shadow-2xl"
      >
        <div className="flex items-center gap-3">
          {/* Neon 4-Block Emblem */}
          <div className="w-7 h-7 grid grid-cols-2 gap-1">
            <div className="bg-cyan-400 rounded-[2px] shadow-[0_0_8px_rgba(34,211,238,0.6)]"></div>
            <div className="bg-cyan-400 rounded-[2px] shadow-[0_0_8px_rgba(34,211,238,0.6)]"></div>
            <div className="bg-cyan-400 rounded-[2px] shadow-[0_0_8px_rgba(34,211,238,0.6)]"></div>
            <div className="bg-cyan-400 rounded-[2px] shadow-[0_0_8px_rgba(34,211,238,0.6)]"></div>
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black tracking-tight uppercase italic text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]">
              TETRIS
            </h1>
            <p className="text-[9px] uppercase tracking-widest text-white/40 font-semibold hidden sm:block">
              Frosted Glass Edition
            </p>
          </div>
        </div>

        {/* Header Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Sound Toggle Button */}
          <button
            type="button"
            id="btn-sound-toggle"
            onClick={toggleSound}
            aria-label={soundMuted ? '음소거 해제' : '음소거'}
            className="p-2 rounded-full backdrop-blur-xl bg-white/5 hover:bg-white/10 active:bg-white/15 text-white/80 border border-white/15 transition-all cursor-pointer shadow-sm"
          >
            {soundMuted ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            )}
          </button>

          {/* Pause / Resume button */}
          {status !== 'idle' && (
            <button
              type="button"
              id="btn-header-pause"
              onClick={pauseGame}
              aria-label={status === 'paused' ? '재개' : '일시정지'}
              className="p-2 rounded-full backdrop-blur-xl bg-white/5 hover:bg-white/10 active:bg-white/15 text-white/80 border border-white/15 transition-all cursor-pointer shadow-sm"
            >
              {status === 'paused' ? (
                <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
              ) : (
                <Pause className="w-4 h-4 text-amber-400 fill-amber-400" />
              )}
            </button>
          )}

          {/* New Game / Restart button */}
          <button
            type="button"
            id="btn-header-restart"
            onClick={startGame}
            className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-cyan-400 text-black font-black text-xs uppercase tracking-widest rounded-full transition-colors shadow-lg cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Game</span>
          </button>
        </div>
      </header>

      {/* Main Game Layout */}
      <div className="relative z-10 w-full max-w-4xl flex-1 flex flex-col lg:flex-row items-center lg:items-start justify-center gap-4 sm:gap-6">
        {/* Left Side Panel (Desktop & Tablet) */}
        <aside className="hidden lg:flex flex-col gap-4 w-60 shrink-0">
          {/* HOLD Box */}
          <div
            id="panel-hold"
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5 shadow-2xl flex flex-col items-center gap-3"
          >
            <p className="text-xs uppercase tracking-widest text-white/40 w-full text-left font-semibold">
              보관 (Hold)
            </p>
            <PiecePreview type={holdPiece} size="md" disabled={!canHold} />
            <span className="text-[10px] uppercase tracking-wider text-white/40 font-mono">
              키: C / Shift
            </span>
          </div>

          {/* Controls Guide */}
          <ControlsGuide />
        </aside>

        {/* Center: Tetris Game Board */}
        <section className="flex flex-col items-center">
          {/* Mobile Top Mini Bar (Hold & Next preview mini on mobile) */}
          <div className="flex lg:hidden items-center justify-between w-full max-w-[320px] mb-2 px-1">
            {/* Mobile Hold */}
            <div className="flex items-center gap-2 backdrop-blur-xl bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 shadow-md">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">HOLD</span>
              <PiecePreview type={holdPiece} size="sm" disabled={!canHold} />
            </div>

            {/* Mobile Next (First in queue) */}
            <div className="flex items-center gap-2 backdrop-blur-xl bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 shadow-md">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">NEXT</span>
              <PiecePreview type={nextPieces[0] || null} size="sm" />
            </div>
          </div>

          {/* Board Frame Container */}
          <div className="relative">
            <Board
              board={board}
              currentPiece={currentPiece}
              ghostPiece={ghostPiece}
              clearedRows={clearedRows}
            />

            {/* Idle / Start Overlay */}
            {status === 'idle' && (
              <div
                id="start-game-overlay"
                className="absolute inset-0 bg-black/75 backdrop-blur-xl z-30 flex flex-col items-center justify-center p-6 rounded-2xl text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-cyan-400/20 border border-cyan-400/50 flex items-center justify-center text-cyan-400 mb-4 shadow-[0_0_25px_rgba(34,211,238,0.4)] animate-pulse">
                  <Play className="w-7 h-7 ml-0.5 fill-cyan-400" />
                </div>
                <h2 className="text-2xl font-black text-white uppercase italic tracking-tight mb-1">
                  테트리스 시작
                </h2>
                <p className="text-xs uppercase tracking-wider text-white/50 mb-5 max-w-[220px]">
                  블록을 배치하여 가로줄을 완성하고 최고 기록을 달성해보세요!
                </p>
                <button
                  type="button"
                  id="btn-start-game"
                  onClick={startGame}
                  className="px-8 py-3 bg-white text-black hover:bg-cyan-400 active:bg-cyan-300 font-black rounded-full text-xs uppercase tracking-widest transition-colors shadow-2xl cursor-pointer"
                >
                  게임 시작 (START)
                </button>
              </div>
            )}

            {/* Paused Overlay Modal */}
            {status === 'paused' && (
              <PauseModal onResume={pauseGame} onRestart={startGame} />
            )}

            {/* Game Over Modal */}
            {status === 'gameover' && (
              <GameOverModal stats={stats} onRestart={startGame} />
            )}
          </div>

          {/* Mobile On-Screen Touch Controls */}
          <div className="flex lg:hidden w-full justify-center">
            <MobileControls
              onMoveLeft={() => movePiece(-1)}
              onMoveRight={() => movePiece(1)}
              onRotateCW={() => rotatePiece('CW')}
              onRotateCCW={() => rotatePiece('CCW')}
              onSoftDrop={softDrop}
              onHardDrop={hardDrop}
              onHold={hold}
              canHold={canHold}
              disabled={status !== 'playing'}
            />
          </div>
        </section>

        {/* Right Side Panel */}
        <aside className="w-full lg:w-60 shrink-0 flex flex-col gap-4 max-w-[320px] lg:max-w-none">
          {/* NEXT Pieces Queue (Desktop only) */}
          <div
            id="panel-next"
            className="hidden lg:flex backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5 shadow-2xl flex-col items-center gap-3"
          >
            <p className="text-xs uppercase tracking-widest text-white/40 w-full text-left font-semibold">
              다음 블록 (Next)
            </p>
            <div className="flex flex-col gap-2.5">
              {nextPieces.slice(0, 3).map((type, idx) => (
                <PiecePreview key={idx} type={type} size="sm" />
              ))}
            </div>
          </div>

          {/* Score & Stats Panel */}
          <ScorePanel stats={stats} />
        </aside>
      </div>

      {/* Footer */}
      <footer className="relative z-10 mt-4 py-2 px-6 text-center text-xs text-white/40 backdrop-blur-md bg-white/[0.02] border border-white/5 rounded-full">
        <p className="tracking-wide">
          클래식 테트리스 • 화살표 키 및 스페이스바로 플레이하세요
        </p>
      </footer>
    </main>
  );
}
