import React from "react";
import LoadingTest3arbon from "./loading-test-3arbon";

const LoadingProgress = ({ status, progress, currentStep, totalSteps }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto px-6">
      {/* Original Loader (Inline Mode with fixed dimensions) */}
      <div className="mb-8 w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
        <LoadingTest3arbon inline={true} />
      </div>
      
      {/* Progress Information - Simplified & Integrated */}
      <div className="w-full flex flex-col items-center space-y-6 mt-4">
        
        {status && (
          <div className="text-center">
            <h2 className="text-[#d4af37] font-bold text-2xl tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] uppercase">
              {status}
            </h2>
            {currentStep !== undefined && totalSteps !== undefined && (
              <p className="text-white/60 text-xs font-bold tracking-[0.2em] mt-2 uppercase">
                Progress: {currentStep} / {totalSteps}
              </p>
            )}
          </div>
        )}
        
        {progress !== undefined && (
          <div className="w-full flex flex-col items-center space-y-4">
            {/* Minimalist Progress Bar */}
            <div className="w-full h-2 bg-white/10 dark:bg-zinc-800/60 rounded-full overflow-hidden border border-white/5 relative">
              <div 
                className="h-full bg-gradient-to-r from-[#b8860b] via-[#d4af37] to-[#f4cf57] transition-all duration-700 ease-out relative"
                style={{ width: `${progress}%` }}
              >
                 <div className="absolute inset-0 w-full h-full bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] bg-[length:200%_100%] animate-shimmer pointer-events-none" />
              </div>
            </div>
            
            {/* Completion Percentage */}
            <div className="flex items-baseline space-x-1">
               <span className="text-[#d4af37] font-black text-2xl tabular-nums leading-none">
                {Math.min(100, Math.max(0, progress))}
              </span>
               <span className="text-[#d4af37]/60 font-bold text-sm">%</span>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LoadingProgress;
