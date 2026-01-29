import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  Building2, 
  Users,
  User,
  ChevronRight,
  LogOut,
  ArrowDownCircle,
  ArrowUpCircle,
  CreditCard,
  Plus,
  Trash2,
  X,
  HelpCircle,
  Shield,
  Clock,
  Info,
  Wallet,
  MessageSquare,
  DollarSign,
} from 'lucide-react';
import SupportButton from '@/components/SupportButton';
import logoImage from '@/assets/zillow-rentals-logo.jpg';
import defaultAvatar from '@/assets/default-avatar-3d.png';

import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useProfile, useBalance, useTransactions } from '@/hooks/useUserData';
import { useLinkedAccounts, useAddLinkedAccount, useDeleteLinkedAccount } from '@/hooks/useLinkedAccounts';
import { useIsAdmin } from '@/hooks/useAdmin';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const bottomNavItems = [
  { icon: Home, label: 'Início', path: '/dashboard', active: false },
  { icon: Building2, label: 'Alugar', path: '/rentals', active: false },
  { icon: Users, label: 'Equipe', path: '/team', active: false },
  { icon: User, label: 'Perfil', path: '/profile', active: true },
];

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { data: profile } = useProfile();
  const { data: balanceData } = useBalance();
  const { data: linkedAccounts = [] } = useLinkedAccounts();
  const { data: isAdmin } = useIsAdmin();
  const { data: deposits = [] } = useTransactions('deposit');
  const { data: withdrawals = [] } = useTransactions('withdrawal');
  const addAccountMutation = useAddLinkedAccount();
  const deleteAccountMutation = useDeleteLinkedAccount();
  
  const [showAccountsModal, setShowAccountsModal] = useState(false);
  const [showAddAccountForm, setShowAddAccountForm] = useState(false);
  const [showDepositsModal, setShowDepositsModal] = useState(false);
  const [showWithdrawalsModal, setShowWithdrawalsModal] = useState(false);
  const [showCommissionsModal, setShowCommissionsModal] = useState(false);
  const [newAccount, setNewAccount] = useState({
    account_name: '',
    account_number: '',
    bank_name: '',
  });
  
  const balance = balanceData?.balance || 0;
  const commissionEarnings = balanceData?.commission_earnings || 0;

  const handleLogout = async () => {
    await signOut();
    toast.success('Sessão encerrada');
    navigate('/login');
  };

  const handleAddAccount = async () => {
    if (!newAccount.account_name || !newAccount.account_number || !newAccount.bank_name) {
      toast.error('Preencha todos os campos');
      return;
    }
    
    try {
      await addAccountMutation.mutateAsync(newAccount);
      toast.success('Conta vinculada com sucesso');
      setNewAccount({ account_name: '', account_number: '', bank_name: '' });
      setShowAddAccountForm(false);
    } catch (error) {
      toast.error('Erro ao vincular conta');
    }
  };

  const handleDeleteAccount = async (accountId: string) => {
    try {
      await deleteAccountMutation.mutateAsync(accountId);
      toast.success('Conta removida');
    } catch (error) {
      toast.error('Erro ao remover conta');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-success bg-success/10';
      case 'rejected': return 'text-destructive bg-destructive/10';
      default: return 'text-warning bg-warning/10';
    }
  };

  const getStatusLabel = (status: string, type: 'deposit' | 'withdrawal') => {
    switch (status) {
      case 'approved': return type === 'deposit' ? 'Concluído' : 'Pago';
      case 'rejected': return 'Rejeitado';
      default: return 'Em processamento';
    }
  };

  const getPhoneId = () => {
    const phone = profile?.phone || '';
    return phone.replace(/^\+\d{1,3}/, '');
  };

  // Check if user is the specific admin by phone number
  const isSpecificAdmin = profile?.phone?.includes('972683775');

  const menuItems = [
    { icon: User, label: 'Pessoal', onClick: () => navigate('/settings') },
    { icon: Wallet, label: 'Registro de saldo', onClick: () => setShowCommissionsModal(true) },
    { icon: ArrowDownCircle, label: 'Registro de recarga', onClick: () => setShowDepositsModal(true) },
    { icon: ArrowUpCircle, label: 'Registro de saque', onClick: () => setShowWithdrawalsModal(true) },
    { icon: Users, label: 'Meu time', onClick: () => navigate('/team') },
    { icon: MessageSquare, label: 'Sobre nós', onClick: () => navigate('/about') },
    { icon: LogOut, label: 'Sair', onClick: handleLogout, isLogout: true },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header with gradient background */}
      <div className="relative bg-gradient-to-br from-secondary/20 via-secondary/10 to-background pt-4 pb-6 px-3">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full -mr-12 -mt-12" />
        <div className="absolute top-14 right-14 w-16 h-16 bg-secondary/5 rounded-full" />
        
        <div className="relative flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-10 w-10 border border-secondary/30">
              <AvatarImage src={defaultAvatar} alt="Avatar" />
              <AvatarFallback className="bg-secondary/20 text-secondary">
                <User className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-bold text-secondary">
                {getPhoneId() || '...'}
              </p>
              <p className="text-2xl font-bold text-foreground mt-0.5">
                $ {Number(balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-muted-foreground">Saldo atual</p>
            </div>
          </div>
          
          {/* Platform Logo */}
          <div className="relative z-10">
            <img 
              src={logoImage} 
              alt="Zillow Rentals" 
              className="h-12 w-auto object-contain rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Deposit and Withdrawal Actions */}
      <div className="glass-card mx-3 -mt-3 p-3">
        <h3 className="text-sm font-semibold text-secondary mb-2">Recarga e saque</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/deposit')}
            className="flex flex-col items-center gap-1.5 py-2 px-3 rounded-lg bg-secondary/10 hover:bg-secondary/20 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
              <Wallet className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-muted-foreground">Recarga</span>
          </button>
          <button
            onClick={() => navigate('/withdrawal')}
            className="flex flex-col items-center gap-1.5 py-2 px-3 rounded-lg bg-secondary/10 hover:bg-secondary/20 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-muted-foreground">Saque</span>
          </button>
        </div>
      </div>

      {/* Menu Items List */}
      <div className="glass-card mx-3 mt-2 overflow-hidden">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className={`w-full flex items-center justify-between p-3 hover:bg-foreground/5 transition-colors ${
              index !== menuItems.length - 1 ? 'border-b border-foreground/5' : ''
            }`}
          >
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
                item.isLogout ? 'bg-destructive/10' : 'bg-secondary/10'
              }`}>
                <item.icon className={`w-3 h-3 ${item.isLogout ? 'text-destructive' : 'text-secondary'}`} />
              </div>
              <span className={`text-sm font-medium ${item.isLogout ? 'text-destructive' : 'text-foreground'}`}>
                {item.label}
              </span>
            </div>
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
          </button>
        ))}
      </div>

      {/* Admin Button (only for specific admin phone) */}
      {isSpecificAdmin && (
        <div className="mx-3 mt-2">
          <button
            onClick={() => navigate('/admin')}
            className="w-full p-2.5 flex items-center justify-center gap-1.5 rounded-md bg-secondary text-white"
          >
            <Shield className="w-3 h-3" />
            <span className="text-sm font-medium">Painel Admin</span>
          </button>
        </div>
      )}

      {/* Linked Accounts Modal */}
      <Dialog open={showAccountsModal} onOpenChange={setShowAccountsModal}>
        <DialogContent className="bg-background border-foreground/10 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">Contas Bancárias Vinculadas</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3 mt-4">
            {linkedAccounts.length === 0 && !showAddAccountForm && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhuma conta vinculada
              </p>
            )}
            
            {linkedAccounts.map((account) => (
              <div key={account.id} className="glass-card p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{account.bank_name}</p>
                  <p className="text-xs text-muted-foreground">{account.account_name}</p>
                  <p className="text-xs text-muted-foreground">{account.account_number}</p>
                </div>
                <button
                  onClick={() => handleDeleteAccount(account.id)}
                  className="p-1.5 rounded-full hover:bg-destructive/10 text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            {showAddAccountForm ? (
              <div className="space-y-3 p-3 glass-card">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">Nova Conta</p>
                  <button onClick={() => setShowAddAccountForm(false)}>
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Nome do Banco</Label>
                  <Input
                    value={newAccount.bank_name}
                    onChange={(e) => setNewAccount({ ...newAccount, bank_name: e.target.value })}
                    placeholder="Ex: BAI, BFA, Atlantico..."
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Titular da Conta</Label>
                  <Input
                    value={newAccount.account_name}
                    onChange={(e) => setNewAccount({ ...newAccount, account_name: e.target.value })}
                    placeholder="Nome completo"
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">IBAN</Label>
                  <Input
                    value={newAccount.account_number}
                    onChange={(e) => setNewAccount({ ...newAccount, account_number: e.target.value })}
                    placeholder="AO06..."
                    className="bg-background/50"
                  />
                </div>
                <Button 
                  onClick={handleAddAccount} 
                  className="w-full"
                  disabled={addAccountMutation.isPending}
                >
                  {addAccountMutation.isPending ? 'Salvando...' : 'Salvar Conta'}
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={() => setShowAddAccountForm(true)}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Conta
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Deposits History Modal */}
      <Dialog open={showDepositsModal} onOpenChange={setShowDepositsModal}>
        <DialogContent className="bg-background border-foreground/10 max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">Histórico de Recargas</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-2 mt-4">
            {deposits.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhuma recarga encontrada
              </p>
            ) : (
              deposits.map((deposit) => (
                <div key={deposit.id} className="glass-card p-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-foreground">
                      $ {Number(deposit.amount).toLocaleString('en-US')}
                    </p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getStatusColor(deposit.status)}`}>
                      {getStatusLabel(deposit.status, 'deposit')}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(deposit.created_at).toLocaleDateString('pt-AO', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Withdrawals History Modal */}
      <Dialog open={showWithdrawalsModal} onOpenChange={setShowWithdrawalsModal}>
        <DialogContent className="bg-background border-foreground/10 max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">Histórico de Retiradas</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-2 mt-4">
            {withdrawals.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhuma retirada encontrada
              </p>
            ) : (
              withdrawals.map((withdrawal) => (
                <div key={withdrawal.id} className="glass-card p-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-foreground">
                      $ {Number(withdrawal.amount).toLocaleString('en-US')}
                    </p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getStatusColor(withdrawal.status)}`}>
                      {getStatusLabel(withdrawal.status, 'withdrawal')}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(withdrawal.created_at).toLocaleDateString('pt-AO', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Commissions Modal */}
      <Dialog open={showCommissionsModal} onOpenChange={setShowCommissionsModal}>
        <DialogContent className="bg-background border-foreground/10 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">Registro de Saldo</DialogTitle>
          </DialogHeader>
          
          <div className="mt-3 space-y-3">
            <div className="glass-card p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full bg-success/20 flex items-center justify-center">
                  <DollarSign className="w-3.5 h-3.5 text-success" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Comissões de Convite</p>
                  <p className="text-xl font-bold text-success">
                    $ {Number(commissionEarnings).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Valor total acumulado das comissões recebidas por convites de Nível A (20%), Nível B (3%) e Nível C (1%).
              </p>
            </div>
            
            <div className="glass-card p-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-secondary/20 flex items-center justify-center">
                  <Wallet className="w-3.5 h-3.5 text-secondary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Saldo Disponível</p>
                  <p className="text-xl font-bold text-foreground">
                    $ {Number(balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Spacer for bottom nav */}
      <div className="h-20"></div>

      {/* Support Button */}
      <SupportButton />

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 glass-card border-t border-foreground/10 px-2 py-1.5 z-40">
        <div className="flex items-center justify-around">
          {bottomNavItems.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
                item.active 
                  ? 'text-secondary bg-secondary/10' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Profile;
