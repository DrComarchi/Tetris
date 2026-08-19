import React from 'react';
import { GameStats } from '../types';
import { Trophy, Flame, Zap, Layers } from 'lucide-react';

interface ScorePanelProps {
  stats: GameStats;
}

export const ScorePanel: React.FC<ScorePanelProps> = ({ stats }) => {
  return (
    <div className="flex flex-col gap-3.5 w-full">
      {/* Current Score Card */}
      <div
        id="panel-score"
        className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 shadow-2xl flex flex-col transition-all"
      >
        <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-white/40 mb-1 font-semibold">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span>점수 (Score)</span>
        </div>
        <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.4)]">
          {stats.score.toLocaleString()}
        </div>
      </div>

      {/* High Score Card */}
      <div
        id="panel-high-score"
        className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 shadow-2xl flex flex-col transition-all"
      >
        <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-white/40 mb-1 font-semibold">
          <Trophy className="w-3.5 h-3.5 text-yellow-400" />
          <span>최고 기록 (High Score)</span>
        </div>
        <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-yellow-400 drop-shadow-[0_0_12px_rgba(250,204,21,0.3)]">
          {stats.highScore.toLocaleString()}
        </div>
      </div>

      {/* Level & Lines Card */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 shadow-2xl grid grid-cols-2 gap-3">
        <div id="panel-level">
          <div className="text-[10px] uppercase tracking-widest text-white/40 mb-1 font-semibold">
            레벨 (Level)
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-white">
            {stats.level}
          </div>
        </div>

        <div id="panel-lines">
          <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-white/40 mb-1 font-semibold">
            <Layers className="w-3 h-3 text-emerald-400" />
            <span>줄 삭제 (Lines)</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-white">
            {stats.lines}
          </div>
        </div>
      </div>

      {/* Combo Indicator if active */}
      {stats.combos > 1 && (
        <div
          id="combo-indicator"
          className="backdrop-blur-xl bg-gradient-to-r from-orange-500/20 to-rose-500/20 border border-orange-500/30 rounded-2xl p-3 shadow-xl flex items-center justify-between animate-pulse"
        >
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-orange-300">
              COMBO x{stats.combos}
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-orange-200">
            +{ (stats.combos - 1) * 50 * stats.level } pts
          </span>
        </div>
      )}
    </div>
  );
};
