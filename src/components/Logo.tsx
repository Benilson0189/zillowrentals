import React from 'react';
import logoImage from '@/assets/zillow-rentals-logo.jpg';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center justify-center mb-6">
      <img 
        src={logoImage} 
        alt="Zillow Rentals" 
        className="h-24 w-auto object-contain rounded-lg"
      />
    </div>
  );
};

export default Logo;
