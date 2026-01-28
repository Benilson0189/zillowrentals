import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, CreditCard, Smartphone, Building2, Check, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { useDeposit } from '@/hooks/useDeposit';

const paymentMethods = [
  { 
    id: 'express', 
    name: 'Transferência Express', 
    icon: Smartphone,
    bankDetails: {
      expressNumber: '923 456 789',
    }
  },
  { 
    id: 'reference', 
    name: 'Pagamento por Referência', 
    icon: CreditCard,
    bankDetails: {
      entity: '00123',
      reference: '123 456 789',
    }
  },
  { 
    id: 'transfer', 
    name: 'Transferência Bancária', 
    icon: Building2,
    bankDetails: {
      bank: 'Banco BAI',
      iban: 'AO06 0040 0000 1234 5678 9012 3',
      accountName: 'ZILLOW RENTALS LLC',
      nif: '5000123456',
    }
  },
];

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.FC<{ className?: string }>;
  bankDetails: {
    expressNumber?: string;
    entity?: string;
    reference?: string;
    bank?: string;
    iban?: string;
    accountName?: string;
    nif?: string;
  };
}

const BankDetailsCard: React.FC<{ method: PaymentMethod }> = ({ method }) => {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado!`);
  };

  const details = method.bankDetails;

  return (
    <div className="mt-4 p-3 bg-secondary/10 border border-secondary/30 rounded-lg">
      <h3 className="text-xs font-semibold text-secondary mb-3">Dados para Pagamento</h3>
      <div className="space-y-2">
        {details.expressNumber && (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-muted-foreground">Número Express</p>
              <p className="text-sm font-medium text-foreground">{details.expressNumber}</p>
            </div>
            <button 
              onClick={() => copyToClipboard(details.expressNumber!, 'Número Express')}
              className="p-1.5 hover:bg-foreground/10 rounded"
            >
              <Copy className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        )}
        {details.entity && (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-muted-foreground">Entidade</p>
              <p className="text-sm font-medium text-foreground">{details.entity}</p>
            </div>
            <button 
              onClick={() => copyToClipboard(details.entity!, 'Entidade')}
              className="p-1.5 hover:bg-foreground/10 rounded"
            >
              <Copy className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        )}
        {details.reference && (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-muted-foreground">Referência</p>
              <p className="text-sm font-medium text-foreground">{details.reference}</p>
            </div>
            <button 
              onClick={() => copyToClipboard(details.reference!, 'Referência')}
              className="p-1.5 hover:bg-foreground/10 rounded"
            >
              <Copy className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        )}
        {details.bank && (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-muted-foreground">Banco</p>
              <p className="text-sm font-medium text-foreground">{details.bank}</p>
            </div>
            <button 
              onClick={() => copyToClipboard(details.bank!, 'Banco')}
              className="p-1.5 hover:bg-foreground/10 rounded"
            >
              <Copy className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        )}
        {details.iban && (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-muted-foreground">IBAN</p>
              <p className="text-sm font-medium text-foreground">{details.iban}</p>
            </div>
            <button 
              onClick={() => copyToClipboard(details.iban!, 'IBAN')}
              className="p-1.5 hover:bg-foreground/10 rounded"
            >
              <Copy className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        )}
        {details.accountName && (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-muted-foreground">Nome</p>
              <p className="text-sm font-medium text-foreground">{details.accountName}</p>
            </div>
            <button 
              onClick={() => copyToClipboard(details.accountName!, 'Nome')}
              className="p-1.5 hover:bg-foreground/10 rounded"
            >
              <Copy className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        )}
        {details.nif && (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-muted-foreground">NIF</p>
              <p className="text-sm font-medium text-foreground">{details.nif}</p>
            </div>
            <button 
              onClick={() => copyToClipboard(details.nif!, 'NIF')}
              className="p-1.5 hover:bg-foreground/10 rounded"
            >
              <Copy className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const DepositFlow: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const depositMutation = useDeposit();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProofFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!amount || !paymentMethod || !proofFile) {
      toast.error('Preencha todos os campos');
      return;
    }

    try {
      await depositMutation.mutateAsync({
        amount: Number(amount),
        paymentMethod,
        proofFile,
      });
      toast.success('Solicitação de depósito enviada!');
      navigate('/deposits');
    } catch (error) {
      toast.error('Erro ao enviar solicitação');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <header className="glass-card mx-3 mt-3 p-3 flex items-center gap-2">
        <button 
          onClick={() => step > 1 ? setStep(step - 1) : navigate('/dashboard')} 
          className="p-1.5 rounded-full hover:bg-foreground/10"
        >
          <ArrowLeft className="w-4 h-4 text-foreground" />
        </button>
        <h1 className="text-base font-semibold text-foreground">Depositar</h1>
        <span className="ml-auto text-xs text-muted-foreground">Passo {step}/3</span>
      </header>

      <div className="mx-3 mt-4">
        {/* Step 1: Amount */}
        {step === 1 && (
          <div className="glass-card p-4">
            <h2 className="text-sm font-medium text-foreground mb-4">Valor do Depósito</h2>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">Kz</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="input-dark pl-10 text-lg"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Mínimo: Kz 1.000</p>
            
            {/* Deposit Info */}
            <div className="mt-4 p-3 bg-secondary/10 border border-secondary/30 rounded-lg">
            <h3 className="text-xs font-semibold text-secondary mb-2">ℹ️ Informações de Depósito</h3>
              <ul className="text-[11px] text-muted-foreground space-y-1">
                <li>• Valor mínimo de depósito: <span className="text-foreground font-medium">Kz 1.000</span></li>
                <li>• Depósitos são processados em <span className="text-foreground font-medium">5 a 20 minutos</span></li>
                <li>• Guarde o comprovante de pagamento</li>
                <li>• Após confirmar, envie o comprovante na próxima etapa</li>
              </ul>
            </div>
            
            <button
              onClick={() => Number(amount) >= 1000 ? setStep(2) : toast.error('Valor mínimo: Kz 1.000')}
              className="btn-primary mt-4"
            >
              Continuar
            </button>
          </div>
        )}

        {/* Step 2: Payment Method + Bank Details */}
        {step === 2 && (
          <div className="glass-card p-4">
            <h2 className="text-sm font-medium text-foreground mb-4">Método de Pagamento</h2>
            <div className="space-y-2">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                    paymentMethod === method.id
                      ? 'border-secondary bg-secondary/10'
                      : 'border-foreground/10 hover:border-foreground/20'
                  }`}
                >
                  <method.icon className={`w-5 h-5 ${paymentMethod === method.id ? 'text-secondary' : 'text-muted-foreground'}`} />
                  <span className="text-sm text-foreground">{method.name}</span>
                  {paymentMethod === method.id && (
                    <Check className="w-4 h-4 text-secondary ml-auto" />
                  )}
                </button>
              ))}
            </div>
            
            {/* Bank Details */}
            {paymentMethod && (
              <BankDetailsCard 
                method={paymentMethods.find(m => m.id === paymentMethod)!} 
              />
            )}
            
            <button
              onClick={() => paymentMethod ? setStep(3) : toast.error('Selecione um método')}
              className="btn-primary mt-4"
            >
              Continuar
            </button>
          </div>
        )}

        {/* Step 3: Upload Proof */}
        {step === 3 && (
          <div className="glass-card p-4">
            <h2 className="text-sm font-medium text-foreground mb-4">Comprovante de Pagamento</h2>
            
            <div className="mb-4 p-3 bg-foreground/5 rounded-lg">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Valor:</span>
                <span className="text-foreground font-medium">Kz {Number(amount).toLocaleString('pt-AO')}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Método:</span>
                <span className="text-foreground">{paymentMethods.find(m => m.id === paymentMethod)?.name}</span>
              </div>
            </div>

            <label className="block">
              <div className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                previewUrl ? 'border-secondary' : 'border-foreground/20 hover:border-foreground/40'
              }`}>
                {previewUrl ? (
                  <img src={previewUrl} alt="Comprovante" className="max-h-40 mx-auto rounded" />
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Clique para enviar comprovante</p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG até 5MB</p>
                  </>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            <button
              onClick={handleSubmit}
              disabled={!proofFile || depositMutation.isPending}
              className="btn-primary mt-4 disabled:opacity-50"
            >
              {depositMutation.isPending ? 'Enviando...' : 'Enviar Solicitação'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepositFlow;
