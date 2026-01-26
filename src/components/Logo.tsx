import React from 'react';
import { Home } from 'lucide-react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
        <Home className="w-6 h-6 text-white" />
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-bold text-foreground tracking-tight">Zillow</span>
        <span className="text-[10px] text-secondary font-medium tracking-widest">RENTALS</span>
      </div>
    </div>
  );
};

export default Logo;
