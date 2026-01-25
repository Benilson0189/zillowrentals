import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import Logo from '@/components/Logo';
import IconInput from '@/components/IconInput';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, user } = useAuth();
  const [email, setEmail] = useState('');
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
    
    if (!email || !password) {
      toast.error('Preencha todos os campos');
      return;
    }

    setIsLoading(true);
    
    const { error } = await signIn(email, password);
    
    if (error) {
      toast.error('Email ou senha incorretos');
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
            icon={Mail}
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="Email"
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
