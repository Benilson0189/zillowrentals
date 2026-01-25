import React, { useState } from 'react';
import { Phone, ChevronDown } from 'lucide-react';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const countryCodes = [
  { code: '+244', country: 'AO', flag: '🇦🇴' },
  { code: '+55', country: 'BR', flag: '🇧🇷' },
  { code: '+351', country: 'PT', flag: '🇵🇹' },
  { code: '+1', country: 'US', flag: '🇺🇸' },
];

const PhoneInput: React.FC<PhoneInputProps> = ({ value, onChange, placeholder = 'Número de telefone' }) => {
  const [selectedCode, setSelectedCode] = useState(countryCodes[0]);
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="icon-input-wrapper">
      <Phone className="icon w-5 h-5" />
      <div className="relative w-full">
        <div className="flex items-center input-dark w-full">
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-1 pr-2 border-r border-white/10 mr-2 text-foreground"
          >
            <span>{selectedCode.flag}</span>
            <span className="text-sm">{selectedCode.code}</span>
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </button>
          <input
            type="tel"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
          />
        </div>
        {showDropdown && (
          <div className="absolute top-full left-0 mt-1 w-full glass-card p-2 z-10">
            {countryCodes.map((country) => (
              <button
                key={country.code}
                type="button"
                onClick={() => {
                  setSelectedCode(country);
                  setShowDropdown(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 text-foreground"
              >
                <span>{country.flag}</span>
                <span>{country.code}</span>
                <span className="text-muted-foreground text-sm">{country.country}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhoneInput;
