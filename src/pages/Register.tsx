import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, User, Mail, Phone } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import Logo from '@/components/Logo';
import IconInput from '@/components/IconInput';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { signUp, user } = useAuth();
  const [searchParams] = useSearchParams();
  const inviteCode = searchParams.get('inviteCode') || '';

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState(inviteCode);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !phone) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setIsLoading(true);
    
    const { error } = await signUp(email, password, phone, code);
    
    if (error) {
      toast.error(error.message || 'Erro ao criar conta');
      setIsLoading(false);
      return;
    }
    
    toast.success('Conta criada com sucesso!');
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
            placeholder="Senha (mínimo 6 caracteres)"
          />
          
          <IconInput
            icon={User}
            value={code}
            onChange={setCode}
            placeholder="Código de convite (opcional)"
          />
          
          <div className="pt-3 space-y-2">
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
