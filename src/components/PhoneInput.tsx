import React, { useState } from 'react';
import { Phone, ChevronDown } from 'lucide-react';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  countryCode: string;
  onCountryCodeChange: (code: string) => void;
  placeholder?: string;
}

const countryCodes = [
  { code: '+244', country: 'Angola', flag: '🇦🇴' },
  { code: '+55', country: 'Brasil', flag: '🇧🇷' },
  { code: '+351', country: 'Portugal', flag: '🇵🇹' },
  { code: '+258', country: 'Moçambique', flag: '🇲🇿' },
  { code: '+238', country: 'Cabo Verde', flag: '🇨🇻' },
  { code: '+1', country: 'EUA', flag: '🇺🇸' },
];

const PhoneInput: React.FC<PhoneInputProps> = ({ 
  value, 
  onChange, 
  countryCode, 
  onCountryCodeChange,
  placeholder = 'Número de telefone' 
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  
  const selectedCountry = countryCodes.find(c => c.code === countryCode) || countryCodes[0];

  return (
    <div className="icon-input-wrapper">
      <Phone className="icon w-5 h-5" />
      <div className="relative w-full">
        <div className="flex items-center input-dark w-full">
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-1 pr-2 border-r border-white/10 mr-2 text-foreground shrink-0"
          >
            <span>{selectedCountry.flag}</span>
            <span className="text-sm">{selectedCountry.code}</span>
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </button>
          <input
            type="tel"
            value={value}
            onChange={(e) => onChange(e.target.value.replace(/\D/g, ''))}
            placeholder={placeholder}
            className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground min-w-0"
          />
        </div>
        {showDropdown && (
          <div className="absolute top-full left-0 mt-1 w-full bg-card border border-border rounded-lg shadow-lg p-2 z-50">
            {countryCodes.map((country) => (
              <button
                key={country.code}
                type="button"
                onClick={() => {
                  onCountryCodeChange(country.code);
                  setShowDropdown(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent text-foreground transition-colors"
              >
                <span>{country.flag}</span>
                <span className="font-medium">{country.code}</span>
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
