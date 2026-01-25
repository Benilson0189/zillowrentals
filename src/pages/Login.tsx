import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Phone } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import Logo from '@/components/Logo';
import IconInput from '@/components/IconInput';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { signInWithPhone, user } = useAuth();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone || !password) {
      toast.error('Preencha todos os campos');
      return;
    }

    setIsLoading(true);
    
    const { error } = await signInWithPhone(phone, password);
    
    if (error) {
      toast.error('Telefone ou senha incorretos');
      setIsLoading(false);
      return;
    }
    
    toast.success('Login realizado com sucesso!');
    navigate('/dashboard');
  };

  return (
    <AuthLayout>
      <div className="glass-card p-6">
        <Logo />
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <IconInput
            icon={Phone}
            type="tel"
            value={phone}
            onChange={setPhone}
            placeholder="Telefone (+244...)"
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
              className="text-xs text-secondary hover:underline"
            >
              Esqueceu a senha?
            </button>
          </div>
          
          <div className="pt-3 space-y-2">
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
