import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Plus, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { useWithdrawal } from '@/hooks/useWithdrawal';
import { useLinkedAccounts, useAddLinkedAccount } from '@/hooks/useLinkedAccounts';
import { useBalance } from '@/hooks/useUserData';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const WithdrawalFlow: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('');
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [newAccount, setNewAccount] = useState({
    account_name: '',
    account_number: '',
    bank_name: '',
  });

  const { data: balance } = useBalance();
  const { data: linkedAccounts, isLoading: accountsLoading } = useLinkedAccounts();
  const withdrawalMutation = useWithdrawal();
  const addAccountMutation = useAddLinkedAccount();

  const availableBalance = balance?.balance || 0;

  const handleAddAccount = async () => {
    if (!newAccount.account_name || !newAccount.account_number || !newAccount.bank_name) {
      toast.error('Preencha todos os campos');
      return;
    }

    try {
      await addAccountMutation.mutateAsync(newAccount);
      toast.success('Conta adicionada!');
      setShowAddAccount(false);
      setNewAccount({ account_name: '', account_number: '', bank_name: '' });
    } catch (error) {
      toast.error('Erro ao adicionar conta');
    }
  };

  const handleSubmit = async () => {
    if (!amount || !selectedAccount) {
      toast.error('Preencha todos os campos');
      return;
    }

    if (Number(amount) > availableBalance) {
      toast.error('Saldo insuficiente');
      return;
    }

    try {
      await withdrawalMutation.mutateAsync({
        amount: Number(amount),
        linkedAccountId: selectedAccount,
      });
      toast.success('Solicitação de saque enviada!');
      navigate('/withdrawals');
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
        <h1 className="text-base font-semibold text-foreground">Sacar</h1>
        <span className="ml-auto text-xs text-muted-foreground">Passo {step}/2</span>
      </header>

      <div className="mx-3 mt-4">
        {/* Balance Info */}
        <div className="glass-card p-3 mb-4 flex items-center gap-3">
          <Wallet className="w-5 h-5 text-secondary" />
          <div>
            <p className="text-xs text-muted-foreground">Saldo Disponível</p>
            <p className="text-sm font-semibold text-foreground">
              Kz {Number(availableBalance).toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Step 1: Amount */}
        {step === 1 && (
          <div className="glass-card p-4">
            <h2 className="text-sm font-medium text-foreground mb-4">Valor do Saque</h2>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">Kz</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="input-dark pl-10 text-lg"
                max={availableBalance}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Mínimo: Kz 5.000</p>
            
            <button
              onClick={() => {
                if (Number(amount) < 5000) {
                  toast.error('Valor mínimo: Kz 5.000');
                  return;
                }
                if (Number(amount) > availableBalance) {
                  toast.error('Saldo insuficiente');
                  return;
                }
                setStep(2);
              }}
              className="btn-primary mt-4"
            >
              Continuar
            </button>
          </div>
        )}

        {/* Step 2: Select Account */}
        {step === 2 && (
          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-foreground">Conta para Saque</h2>
              <button
                onClick={() => setShowAddAccount(true)}
                className="flex items-center gap-1 text-xs text-secondary hover:underline"
              >
                <Plus className="w-3 h-3" />
                Adicionar
              </button>
            </div>

            {accountsLoading ? (
              <div className="text-center py-6">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-secondary mx-auto"></div>
              </div>
            ) : linkedAccounts && linkedAccounts.length > 0 ? (
              <div className="space-y-2">
                {linkedAccounts.map((account) => (
                  <button
                    key={account.id}
                    onClick={() => setSelectedAccount(account.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left ${
                      selectedAccount === account.id
                        ? 'border-secondary bg-secondary/10'
                        : 'border-foreground/10 hover:border-foreground/20'
                    }`}
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{account.account_name}</p>
                      <p className="text-xs text-muted-foreground">{account.bank_name}</p>
                      <p className="text-xs text-muted-foreground">****{account.account_number.slice(-4)}</p>
                    </div>
                    {selectedAccount === account.id && (
                      <Check className="w-4 h-4 text-secondary" />
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground mb-2">Nenhuma conta vinculada</p>
                <button
                  onClick={() => setShowAddAccount(true)}
                  className="text-sm text-secondary hover:underline"
                >
                  Adicionar conta
                </button>
              </div>
            )}

            <div className="mt-4 p-3 bg-foreground/5 rounded-lg">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Valor do saque:</span>
                <span className="text-foreground font-medium">Kz {Number(amount).toLocaleString('pt-AO')}</span>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!selectedAccount || withdrawalMutation.isPending}
              className="btn-primary mt-4 disabled:opacity-50"
            >
              {withdrawalMutation.isPending ? 'Enviando...' : 'Enviar Pedido de Saque'}
            </button>
          </div>
        )}
      </div>

      {/* Add Account Modal */}
      <Dialog open={showAddAccount} onOpenChange={setShowAddAccount}>
        <DialogContent className="glass-card border-foreground/10">
          <DialogHeader>
            <DialogTitle className="text-foreground">Adicionar Conta</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <input
              type="text"
              value={newAccount.account_name}
              onChange={(e) => setNewAccount({ ...newAccount, account_name: e.target.value })}
              placeholder="Nome do Titular"
              className="input-dark"
            />
            <input
              type="text"
              value={newAccount.bank_name}
              onChange={(e) => setNewAccount({ ...newAccount, bank_name: e.target.value })}
              placeholder="Nome do Banco"
              className="input-dark"
            />
            <input
              type="text"
              value={newAccount.account_number}
              onChange={(e) => setNewAccount({ ...newAccount, account_number: e.target.value })}
              placeholder="Número da Conta (IBAN)"
              className="input-dark"
            />
            <button
              onClick={handleAddAccount}
              disabled={addAccountMutation.isPending}
              className="btn-primary disabled:opacity-50"
            >
              {addAccountMutation.isPending ? 'Adicionando...' : 'Adicionar Conta'}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WithdrawalFlow;
