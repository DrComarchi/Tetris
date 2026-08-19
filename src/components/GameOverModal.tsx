import React from 'react';
import { GameStats } from '../types';
import { RotateCcw, Trophy, Award, Flame } from 'lucide-react';

interface GameOverModalProps {
  stats: GameStats;
  onRestart: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ stats, onRestart }) => {
  const isNewHighScore = stats.score > 0 && stats.score >= stats.highScore;

  return (
    <div
      id="game-over-modal-overlay"
      className="absolute inset-0 bg-black/75 backdrop-blur-xl z-40 flex items-center justify-center p-4 rounded-2xl animate-fade-in"
    >
      <div
        id="game-over-dialog"
        className="w-full max-w-xs backdrop-blur-2xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-[0_0_50px_rgba(0,0,0,0.8)] text-center flex flex-col items-center gap-4"
      >
        <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.3)]">
          <Award className="w-6 h-6" />
        </div>

        <div>
          <h2 className="text-2xl font-black tracking-tight text-white mb-1 uppercase italic">
            GAME OVER
          </h2>
          <p className="text-xs uppercase tracking-widest text-white/50">게임이 종료되었습니다</p>
        </div>

        {isNewHighScore && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400/20 border border-yellow-400/50 text-yellow-300 text-xs font-bold uppercase tracking-wider animate-bounce shadow-[0_0_15px_rgba(250,204,21,0.3)]">
            <Trophy className="w-3.5 h-3.5" />
            <span>최고 점수 갱신!</span>
          </div>
        )}

        <div className="w-full backdrop-blur-xl bg-black/40 rounded-xl p-3.5 border border-white/10 flex flex-col gap-2.5">
          <div className="flex justify-between items-center text-xs">
            <span className="uppercase tracking-widest text-white/50 text-[10px]">최종 점수</span>
            <span className="font-mono font-bold text-cyan-400 text-lg">
              {stats.score.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="uppercase tracking-widest text-white/50 text-[10px]">도달 레벨</span>
            <span className="font-mono font-bold text-white text-base">{stats.level}</span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="uppercase tracking-widest text-white/50 text-[10px]">제거한 줄</span>
            <span className="font-mono font-bold text-white text-base">{stats.lines}</span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="uppercase tracking-widest text-white/50 text-[10px]">최대 콤보</span>
            <span className="font-mono font-bold text-orange-400 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 inline" />
              {stats.combos > 0 ? `x${stats.combos}` : '-'}
            </span>
          </div>
        </div>

        <button
          type="button"
          id="btn-restart-gameover"
          onClick={onRestart}
          className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-white hover:bg-cyan-400 text-black font-black text-xs uppercase tracking-widest transition-colors shadow-lg cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>다시 시작하기 (Retry)</span>
        </button>
      </div>
    </div>
  );
};
