import React from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({ onResume, onRestart }) => {
  return (
    <div
      id="pause-modal-overlay"
      className="absolute inset-0 bg-black/75 backdrop-blur-xl z-40 flex items-center justify-center p-4 rounded-2xl animate-fade-in"
    >
      <div
        id="pause-dialog"
        className="w-full max-w-xs backdrop-blur-2xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-[0_0_50px_rgba(0,0,0,0.8)] text-center flex flex-col items-center gap-4"
      >
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.3)]">
          <Play className="w-6 h-6 ml-0.5 fill-cyan-400" />
        </div>

        <div>
          <h2 className="text-2xl font-black tracking-tight text-white mb-1 uppercase italic">
            PAUSED
          </h2>
          <p className="text-xs uppercase tracking-widest text-white/50">게임이 일시 정지되었습니다</p>
        </div>

        <div className="w-full flex flex-col gap-2.5 mt-2">
          <button
            type="button"
            id="btn-resume-game"
            onClick={onResume}
            className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-white hover:bg-cyan-400 text-black font-black text-xs uppercase tracking-widest transition-colors shadow-lg cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            <span>계속하기 (Resume)</span>
          </button>

          <button
            type="button"
            id="btn-restart-pause"
            onClick={onRestart}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-full backdrop-blur-xl bg-white/5 hover:bg-white/10 active:bg-white/15 text-white/70 hover:text-white border border-white/10 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>새 게임 시작</span>
          </button>
        </div>
      </div>
    </div>
  );
};
