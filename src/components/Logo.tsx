import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          className="w-8 h-8 text-white"
          stroke="currentColor" 
          strokeWidth="2"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-foreground tracking-tight">BOSCH</span>
        <span className="text-xs text-primary font-medium tracking-widest">REXROTH</span>
      </div>
    </div>
  );
};

export default Logo;
