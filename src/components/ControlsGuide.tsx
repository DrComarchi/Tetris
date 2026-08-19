import React from 'react';
import { Keyboard } from 'lucide-react';

export const ControlsGuide: React.FC = () => {
  return (
    <div
      id="controls-guide-panel"
      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 shadow-2xl text-xs text-white/60"
    >
      <p className="text-[11px] uppercase tracking-widest text-white/40 mb-3.5 font-semibold">
        조작법 (Controls)
      </p>

      <div className="space-y-2.5 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-white/60 font-medium">이동 (Move)</span>
          <div className="flex gap-1">
            <kbd className="px-2 py-0.5 bg-white/10 rounded border border-white/20 text-[10px] text-white font-mono">
              ←
            </kbd>
            <kbd className="px-2 py-0.5 bg-white/10 rounded border border-white/20 text-[10px] text-white font-mono">
              →
            </kbd>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-white/60 font-medium">회전 (Rotate)</span>
          <div className="flex gap-1">
            <kbd className="px-2 py-0.5 bg-white/10 rounded border border-white/20 text-[10px] text-white font-mono">
              ↑
            </kbd>
            <kbd className="px-2 py-0.5 bg-white/10 rounded border border-white/20 text-[10px] text-white font-mono">
              X
            </kbd>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-white/60 font-medium">소프트 드롭</span>
          <kbd className="px-2 py-0.5 bg-white/10 rounded border border-white/20 text-[10px] text-white font-mono">
            ↓
          </kbd>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-white/60 font-medium">하드 드롭</span>
          <kbd className="px-3 py-0.5 bg-white/10 rounded border border-white/20 text-[10px] text-white uppercase font-mono">
            Space
          </kbd>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-white/60 font-medium">홀드 (Hold)</span>
          <kbd className="px-2.5 py-0.5 bg-white/10 rounded border border-white/20 text-[10px] text-white font-mono">
            C / Shift
          </kbd>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-white/60 font-medium">일시정지</span>
          <kbd className="px-2 py-0.5 bg-white/10 rounded border border-white/20 text-[10px] text-white font-mono">
            P / Esc
          </kbd>
        </div>
      </div>
    </div>
  );
};
