import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import Logo from '@/components/Logo';
import IconInput from '@/components/IconInput';
import PhoneInput from '@/components/PhoneInput';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { signInWithPhone, user } = useAuth();
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+244');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

    const fullPhone = `${countryCode}${phone}`;

    setIsLoading(true);
    
    const { error } = await signInWithPhone(fullPhone, password);
    
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
          <PhoneInput
            value={phone}
            onChange={setPhone}
            countryCode={countryCode}
            onCountryCodeChange={setCountryCode}
            placeholder="Número de telefone"
          />
          
          <div className="relative">
            <IconInput
              icon={Lock}
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={setPassword}
              placeholder="Senha"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          
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
