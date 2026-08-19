import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  RotateCw,
  RotateCcw,
  ChevronsDown,
  BookmarkCheck,
} from 'lucide-react';

interface MobileControlsProps {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onRotateCW: () => void;
  onRotateCCW: () => void;
  onSoftDrop: () => void;
  onHardDrop: () => void;
  onHold: () => void;
  canHold: boolean;
  disabled?: boolean;
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  onMoveLeft,
  onMoveRight,
  onRotateCW,
  onRotateCCW,
  onSoftDrop,
  onHardDrop,
  onHold,
  canHold,
  disabled = false,
}) => {
  return (
    <div
      id="mobile-touch-controls"
      className="w-full max-w-sm mt-3 pt-1 pb-1 select-none flex flex-col gap-2"
    >
      {/* Top action row: Hold, CCW, CW, Hard Drop */}
      <div className="grid grid-cols-4 gap-2">
        <button
          type="button"
          id="btn-mobile-hold"
          disabled={disabled || !canHold}
          onClick={onHold}
          className="flex flex-col items-center justify-center p-2.5 rounded-xl backdrop-blur-xl bg-white/5 hover:bg-white/10 active:bg-white/20 disabled:opacity-30 text-cyan-300 border border-white/15 shadow-lg transition-transform active:scale-95 touch-manipulation cursor-pointer"
        >
          <BookmarkCheck className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">홀드</span>
        </button>

        <button
          type="button"
          id="btn-mobile-rot-ccw"
          disabled={disabled}
          onClick={onRotateCCW}
          className="flex flex-col items-center justify-center p-2.5 rounded-xl backdrop-blur-xl bg-white/5 hover:bg-white/10 active:bg-white/20 disabled:opacity-30 text-purple-300 border border-white/15 shadow-lg transition-transform active:scale-95 touch-manipulation cursor-pointer"
        >
          <RotateCcw className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">좌회전</span>
        </button>

        <button
          type="button"
          id="btn-mobile-rot-cw"
          disabled={disabled}
          onClick={onRotateCW}
          className="flex flex-col items-center justify-center p-2.5 rounded-xl backdrop-blur-xl bg-white/5 hover:bg-white/10 active:bg-white/20 disabled:opacity-30 text-purple-300 border border-white/15 shadow-lg transition-transform active:scale-95 touch-manipulation cursor-pointer"
        >
          <RotateCw className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">우회전</span>
        </button>

        <button
          type="button"
          id="btn-mobile-hard-drop"
          disabled={disabled}
          onClick={onHardDrop}
          className="flex flex-col items-center justify-center p-2.5 rounded-xl backdrop-blur-xl bg-rose-500/20 hover:bg-rose-500/30 active:bg-rose-500/40 disabled:opacity-30 text-rose-300 border border-rose-400/40 shadow-lg shadow-rose-500/10 transition-transform active:scale-95 touch-manipulation cursor-pointer"
        >
          <ChevronsDown className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">낙하</span>
        </button>
      </div>

      {/* D-Pad bottom row: Left, Down (Soft Drop), Right */}
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          id="btn-mobile-left"
          disabled={disabled}
          onClick={onMoveLeft}
          className="flex items-center justify-center p-3.5 rounded-xl backdrop-blur-xl bg-white/5 hover:bg-white/10 active:bg-white/20 disabled:opacity-30 text-white border border-white/15 shadow-lg transition-transform active:scale-95 touch-manipulation cursor-pointer"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <button
          type="button"
          id="btn-mobile-soft-drop"
          disabled={disabled}
          onClick={onSoftDrop}
          className="flex items-center justify-center p-3.5 rounded-xl backdrop-blur-xl bg-white/5 hover:bg-white/10 active:bg-white/20 disabled:opacity-30 text-cyan-300 border border-white/15 shadow-lg transition-transform active:scale-95 touch-manipulation cursor-pointer"
        >
          <ArrowDown className="w-6 h-6" />
        </button>

        <button
          type="button"
          id="btn-mobile-right"
          disabled={disabled}
          onClick={onMoveRight}
          className="flex items-center justify-center p-3.5 rounded-xl backdrop-blur-xl bg-white/5 hover:bg-white/10 active:bg-white/20 disabled:opacity-30 text-white border border-white/15 shadow-lg transition-transform active:scale-95 touch-manipulation cursor-pointer"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
