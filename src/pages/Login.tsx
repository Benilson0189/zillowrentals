import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import Logo from '@/components/Logo';
import PhoneInput from '@/components/PhoneInput';
import IconInput from '@/components/IconInput';
import { toast } from 'sonner';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Login realizado com sucesso!');
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
          
          <div className="text-right">
            <button
              type="button"
              className="text-sm text-primary hover:underline"
            >
              Esqueceu a senha?
            </button>
          </div>
          
          <div className="pt-4 space-y-3">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary disabled:opacity-50"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="btn-outline"
            >
              Criar nova conta
            </button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
