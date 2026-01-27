import React, { useState } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import Logo from '@/components/Logo';
import IconInput from '@/components/IconInput';
import PhoneInput from '@/components/PhoneInput';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { signUpWithPhone, user } = useAuth();
  const [searchParams] = useSearchParams();
  const { inviteCode: urlInviteCode } = useParams();
  // Support both /r/:inviteCode and /register?inviteCode=...
  const inviteCode = urlInviteCode || searchParams.get('inviteCode') || '';

  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+244');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [code, setCode] = useState(inviteCode);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone || !password) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    const fullPhone = `${countryCode}${phone}`;

    setIsLoading(true);
    
    const { error } = await signUpWithPhone(fullPhone, password, code);
    
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
              placeholder="Senha (mínimo 6 caracteres)"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <div className="relative">
            <IconInput
              icon={Lock}
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="Confirmar Senha"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          
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
