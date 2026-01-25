import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          className="w-6 h-6 text-white"
          stroke="currentColor" 
          strokeWidth="2"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-bold text-foreground tracking-tight">BOSCH</span>
        <span className="text-[10px] text-secondary font-medium tracking-widest">REXROTH</span>
      </div>
    </div>
  );
};

export default Logo;
