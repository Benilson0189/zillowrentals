import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, User } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import Logo from '@/components/Logo';
import PhoneInput from '@/components/PhoneInput';
import IconInput from '@/components/IconInput';
import { toast } from 'sonner';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inviteCode = searchParams.get('inviteCode') || '';

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState(inviteCode);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate registration
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Conta criada com sucesso!');
    navigate('/dashboard');
    setIsLoading(false);
  };

  return (
    <AuthLayout>
      <div className="glass-card p-8">
        <Logo />
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <PhoneInput
            value={phone}
            onChange={setPhone}
            placeholder="Número de telefone"
          />
          
          <IconInput
            icon={Lock}
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="Senha"
          />
          
          <IconInput
            icon={User}
            value={code}
            onChange={setCode}
            placeholder="Código de convite"
          />
          
          <div className="pt-4 space-y-3">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary disabled:opacity-50"
            >
              {isLoading ? 'Registrando...' : 'Registrar'}
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="btn-outline"
            >
              Já tenho uma conta
            </button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Register;
