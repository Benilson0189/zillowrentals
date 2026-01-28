import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  Building2, 
  Users,
  User,
  ChevronRight,
  LogOut,
  Bell,
  ArrowDownCircle,
  ArrowUpCircle,
  CreditCard,
  Plus,
  Trash2,
  X,
  Gift,
  HelpCircle,
  Shield,
  Clock,
  Info,
} from 'lucide-react';
import SupportButton from '@/components/SupportButton';

import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useProfile, useBalance, useTransactions } from '@/hooks/useUserData';
import { useLinkedAccounts, useAddLinkedAccount, useDeleteLinkedAccount } from '@/hooks/useLinkedAccounts';
import { useIsAdmin } from '@/hooks/useAdmin';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
  const [newAccount, setNewAccount] = useState({
    account_name: '',
    account_number: '',
    bank_name: '',
  });
  
  const balance = balanceData?.balance || 0;
  const totalEarnings = balanceData?.total_earnings || 0;
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved': return 'Aprovado';
      case 'rejected': return 'Rejeitado';
      default: return 'Pendente';
    }
  };

  const menuItems = [
    {
      icon: ArrowDownCircle,
      label: 'Recarga',
      color: 'text-success',
      onClick: () => navigate('/deposit'),
    },
    {
      icon: ArrowUpCircle,
      label: 'Retirada',
      color: 'text-warning',
      onClick: () => navigate('/withdrawal'),
    },
    {
      icon: Clock,
      label: 'Histórico de Recargas',
      subtitle: `${deposits.length} transações`,
      color: 'text-success',
      onClick: () => setShowDepositsModal(true),
    },
    {
      icon: Clock,
      label: 'Histórico de Retiradas',
      subtitle: `${withdrawals.length} transações`,
      color: 'text-warning',
      onClick: () => setShowWithdrawalsModal(true),
    },
    {
      icon: CreditCard,
      label: 'Informações Pessoais',
      subtitle: 'Contas bancárias vinculadas',
      color: 'text-secondary',
      onClick: () => setShowAccountsModal(true),
    },
    {
      icon: Gift,
      label: 'Bônus',
      subtitle: 'Check-in diário',
      color: 'text-purple-500',
      onClick: () => navigate('/bonus'),
    },
    {
      icon: HelpCircle,
      label: 'Ajuda',
      subtitle: 'Suporte e FAQ',
      color: 'text-muted-foreground',
      onClick: () => navigate('/help'),
    },
    {
      icon: Info,
      label: 'Sobre Nós',
      subtitle: 'Conheça a plataforma',
      color: 'text-secondary',
      onClick: () => navigate('/about'),
    },
  ];

  const getUserInitial = () => {
    if (profile?.full_name && profile.full_name.trim()) {
      return profile.full_name.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const getDisplayName = () => {
    if (profile?.full_name && profile.full_name.trim()) {
      return profile.full_name;
    }
    return profile?.display_id || 'Usuário';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-card mx-3 mt-3 p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center border-2 border-secondary shadow-lg">
            <span className="text-white font-bold text-xl">
              {getUserInitial()}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {getDisplayName()}
            </p>
            <p className="text-xs text-muted-foreground font-mono tracking-wider">
              ID: {profile?.display_id || '...'}
            </p>
          </div>
        </div>
        <button className="relative p-1.5 rounded-full hover:bg-foreground/10">
          <Bell className="w-4 h-4 text-foreground" />
        </button>
      </header>

      {/* Balance Summary Card */}
      <div className="glass-card mx-3 mt-3 p-4">
        <p className="text-xs text-muted-foreground mb-1">Saldo Total Disponível</p>
        <h2 className="text-2xl font-bold text-foreground">
          $ {Number(balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="bg-foreground/5 rounded-lg p-2">
            <p className="text-[10px] text-muted-foreground">Ganhos Totais</p>
            <p className="text-sm font-semibold text-success">
              $ {Number(totalEarnings).toLocaleString('en-US')}
            </p>
          </div>
          <div className="bg-foreground/5 rounded-lg p-2">
            <p className="text-[10px] text-muted-foreground">Comissões</p>
            <p className="text-sm font-semibold text-secondary">
              $ {Number(commissionEarnings).toLocaleString('en-US')}
            </p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="mx-3 mt-3 space-y-1.5">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className="glass-card w-full p-3 flex items-center justify-between hover:bg-foreground/10 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg bg-foreground/5 ${item.color}`}>
                <item.icon className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="text-sm font-medium text-foreground block">{item.label}</span>
                {item.subtitle && (
                  <span className="text-xs text-muted-foreground">{item.subtitle}</span>
                )}
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        ))}
      </div>

      {/* Admin Button (only for admins) */}
      {isAdmin && (
        <div className="mx-3 mt-3">
          <button
            onClick={() => navigate('/admin')}
            className="w-full p-3 flex items-center justify-center gap-1.5 rounded-lg bg-secondary text-white"
          >
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium">Painel Admin</span>
          </button>
        </div>
      )}

      {/* Logout Button */}
      <div className="mx-3 mt-4">
        <button
          onClick={handleLogout}
          className="w-full p-3 flex items-center justify-center gap-1.5 rounded-lg border border-destructive/50 text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Sair da Conta</span>
        </button>
      </div>

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
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${getStatusColor(deposit.status)}`}>
                      {getStatusLabel(deposit.status)}
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
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${getStatusColor(withdrawal.status)}`}>
                      {getStatusLabel(withdrawal.status)}
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