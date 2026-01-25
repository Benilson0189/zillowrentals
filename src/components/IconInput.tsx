import React from 'react';
import { LucideIcon } from 'lucide-react';

interface IconInputProps {
  icon: LucideIcon;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}

const IconInput: React.FC<IconInputProps> = ({
  icon: Icon,
  type = 'text',
  value,
  onChange,
  placeholder,
  readOnly = false,
}) => {
  return (
    <div className="icon-input-wrapper">
      <Icon className="icon w-5 h-5" />
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        className="input-dark w-full pl-12"
      />
    </div>
  );
};

export default IconInput;
