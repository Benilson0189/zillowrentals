import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Lock, Eye, EyeOff, ArrowLeft, ShieldCheck } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import Logo from '@/components/Logo';
import IconInput from '@/components/IconInput';
import PhoneInput from '@/components/PhoneInput';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

type Step = 'phone' | 'verify' | 'reset';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+244');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

  const phoneToEmail = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    return `${cleanPhone}@zillowrentals.app`;
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone) {
      toast.error('Digite o número da conta');
      return;
    }

    setIsLoading(true);

    const fullPhone = `${countryCode}${phone}`;

    // Check if user exists using the security definer function
    const { data: phoneExists, error: checkError } = await supabase
      .rpc('phone_exists', { phone_number: fullPhone });

    if (checkError || !phoneExists) {
      toast.error('Número de conta não encontrado');
      setIsLoading(false);
      return;
    }

    // Generate a 6-digit code (in production, this would be sent via SMS)
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    
    // For demo purposes, show the code in a toast
    // In production, this would be sent via SMS
    toast.success(`Código de verificação: ${code}`, {
      duration: 10000,
      description: 'Em produção, este código seria enviado por SMS'
    });

    setStep('verify');
    setIsLoading(false);
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (verificationCode.length !== 6) {
      toast.error('Digite o código completo');
      return;
    }

    if (verificationCode !== generatedCode) {
      toast.error('Código inválido');
      return;
    }

    toast.success('Código verificado!');
    setStep('reset');
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      toast.error('Preencha todos os campos');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    setIsLoading(true);

    const fullPhone = `${countryCode}${phone}`;
    const email = phoneToEmail(fullPhone);

    // Sign in with admin to update password
    // Note: In production, you'd use a secure password reset flow
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      // If user is not logged in, we need to use a different approach
      // For now, show a message to contact support
      toast.error('Para redefinir a senha, entre em contato com o suporte');
      setIsLoading(false);
      return;
    }

    toast.success('Senha alterada com sucesso!');
    navigate('/login');
  };

  const renderPhoneStep = () => (
    <form onSubmit={handleSendCode} className="space-y-4">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Phone className="w-8 h-8 text-secondary" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">Recuperar Senha</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Digite o número da sua conta para receber o código de verificação
        </p>
      </div>

      <PhoneInput
        value={phone}
        onChange={setPhone}
        countryCode={countryCode}
        onCountryCodeChange={setCountryCode}
        placeholder="Número da conta"
      />
      
      <div className="pt-3 space-y-2">
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary disabled:opacity-50"
        >
          {isLoading ? 'Enviando...' : 'Enviar Código'}
        </button>
        
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="btn-outline flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Login
        </button>
      </div>
    </form>
  );

  const renderVerifyStep = () => (
    <form onSubmit={handleVerifyCode} className="space-y-4">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-8 h-8 text-secondary" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">Verificar Código</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Digite o código de 6 dígitos enviado para {countryCode}{phone}
        </p>
      </div>

      <div className="flex justify-center">
        <InputOTP
          maxLength={6}
          value={verificationCode}
          onChange={setVerificationCode}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} className="bg-card border-border" />
            <InputOTPSlot index={1} className="bg-card border-border" />
            <InputOTPSlot index={2} className="bg-card border-border" />
            <InputOTPSlot index={3} className="bg-card border-border" />
            <InputOTPSlot index={4} className="bg-card border-border" />
            <InputOTPSlot index={5} className="bg-card border-border" />
          </InputOTPGroup>
        </InputOTP>
      </div>

      <div className="pt-3 space-y-2">
        <button
          type="submit"
          disabled={verificationCode.length !== 6}
          className="btn-primary disabled:opacity-50"
        >
          Verificar
        </button>
        
        <button
          type="button"
          onClick={() => setStep('phone')}
          className="btn-outline flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Alterar Número
        </button>
      </div>
    </form>
  );

  const renderResetStep = () => (
    <form onSubmit={handleResetPassword} className="space-y-4">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-success" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">Nova Senha</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Crie uma nova senha para sua conta
        </p>
      </div>

      <div className="relative">
        <IconInput
          icon={Lock}
          type={showNewPassword ? 'text' : 'password'}
          value={newPassword}
          onChange={setNewPassword}
          placeholder="Nova senha (mínimo 6 caracteres)"
        />
        <button
          type="button"
          onClick={() => setShowNewPassword(!showNewPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      <div className="relative">
        <IconInput
          icon={Lock}
          type={showConfirmPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="Confirmar nova senha"
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
      
      <div className="pt-3">
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary disabled:opacity-50"
        >
          {isLoading ? 'Salvando...' : 'Salvar Nova Senha'}
        </button>
      </div>
    </form>
  );

  return (
    <AuthLayout>
      <div className="glass-card p-6">
        <Logo />
        
        {step === 'phone' && renderPhoneStep()}
        {step === 'verify' && renderVerifyStep()}
        {step === 'reset' && renderResetStep()}
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
