import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  TrendingUp, 
  Users, 
  User,
  Settings,
  Wallet,
  BarChart3,
  Gift,
  CreditCard,
  ChevronRight,
  LogOut,
  Bell,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';

const bottomNavItems = [
  { icon: Home, label: 'Início', path: '/dashboard', active: false },
  { icon: TrendingUp, label: 'Investimentos', path: '/investments', active: false },
  { icon: Users, label: 'Equipe', path: '/team', active: false },
  { icon: User, label: 'Perfil', path: '/profile', active: true },
];

const Profile: React.FC = () => {
  const navigate = useNavigate();
  
  // Mock data - would come from backend
  const userData = {
    name: 'Usuário',
    phone: '+244 923 456 789',
    balance: 15000.00,
    totalEarnings: 5250.00,
    commissionEarnings: 1750.00,
    linkedBank: null as string | null,
  };

  const [showBankModal, setShowBankModal] = useState(false);
  const [bankData, setBankData] = useState({
    bankName: '',
    accountNumber: '',
    iban: '',
  });

  const handleLogout = () => {
    toast.success('Sessão encerrada');
    navigate('/login');
  };

  const handleLinkBank = () => {
    if (!bankData.bankName || !bankData.accountNumber) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    toast.success('Conta bancária vinculada com sucesso!');
    setShowBankModal(false);
    setBankData({ bankName: '', accountNumber: '', iban: '' });
  };

  const menuItems = [
    {
      icon: Wallet,
      label: 'Saldo na Conta',
      value: `Kz ${userData.balance.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}`,
      color: 'text-success',
      onClick: () => navigate('/dashboard'),
    },
    {
      icon: BarChart3,
      label: 'Estatísticas de Ganhos',
      value: `Kz ${userData.totalEarnings.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}`,
      color: 'text-primary',
      onClick: () => {},
    },
    {
      icon: Gift,
      label: 'Ganhos por Comissões',
      value: `Kz ${userData.commissionEarnings.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}`,
      color: 'text-warning',
      onClick: () => {},
    },
    {
      icon: CreditCard,
      label: 'Vincular Conta Bancária',
      value: userData.linkedBank || 'Não vinculada',
      color: userData.linkedBank ? 'text-success' : 'text-muted-foreground',
      onClick: () => setShowBankModal(true),
    },
    {
      icon: Settings,
      label: 'Configurações',
      value: '',
      color: 'text-muted-foreground',
      onClick: () => {},
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-card mx-4 mt-4 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {userData.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-semibold text-foreground">{userData.name}</p>
            <p className="text-sm text-muted-foreground">{userData.phone}</p>
          </div>
        </div>
        <button className="relative p-2 rounded-full hover:bg-white/10">
          <Bell className="w-6 h-6 text-foreground" />
        </button>
      </header>

      {/* Balance Summary Card */}
      <div className="glass-card mx-4 mt-4 p-6">
        <p className="text-sm text-muted-foreground mb-1">Saldo Total Disponível</p>
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Kz {userData.balance.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
        </h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-xl p-4">
            <BarChart3 className="w-5 h-5 text-primary mb-2" />
            <p className="text-xs text-muted-foreground">Total Ganhos</p>
            <p className="font-semibold text-foreground">
              Kz {userData.totalEarnings.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <Gift className="w-5 h-5 text-warning mb-2" />
            <p className="text-xs text-muted-foreground">Comissões</p>
            <p className="font-semibold text-foreground">
              Kz {userData.commissionEarnings.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="mx-4 mt-4 space-y-2">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className="glass-card w-full p-4 flex items-center justify-between hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl bg-white/5 ${item.color}`}>
                <item.icon className="w-5 h-5" />
              </div>
              <span className="font-medium text-foreground">{item.label}</span>
            </div>
            <div className="flex items-center gap-2">
              {item.value && (
                <span className={`text-sm ${item.color}`}>{item.value}</span>
              )}
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </button>
        ))}
      </div>

      {/* Logout Button */}
      <div className="mx-4 mt-6">
        <button
          onClick={handleLogout}
          className="w-full p-4 flex items-center justify-center gap-2 rounded-xl border border-destructive/50 text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sair da Conta</span>
        </button>
      </div>

      {/* Spacer for bottom nav */}
      <div className="h-24"></div>

      {/* Bank Link Modal */}
      {showBankModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="glass-card w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-foreground">Vincular Conta Bancária</h3>
              <button 
                onClick={() => setShowBankModal(false)}
                className="p-2 hover:bg-white/10 rounded-full"
              >
                <ArrowLeft className="w-5 h-5 text-foreground" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  Nome do Banco *
                </label>
                <input
                  type="text"
                  value={bankData.bankName}
                  onChange={(e) => setBankData({ ...bankData, bankName: e.target.value })}
                  placeholder="Ex: BAI, BFA, BIC..."
                  className="input-dark w-full"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  Número da Conta *
                </label>
                <input
                  type="text"
                  value={bankData.accountNumber}
                  onChange={(e) => setBankData({ ...bankData, accountNumber: e.target.value })}
                  placeholder="Número da conta bancária"
                  className="input-dark w-full"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  IBAN (Opcional)
                </label>
                <input
                  type="text"
                  value={bankData.iban}
                  onChange={(e) => setBankData({ ...bankData, iban: e.target.value })}
                  placeholder="AO06..."
                  className="input-dark w-full"
                />
              </div>

              <button
                onClick={handleLinkBank}
                className="btn-primary w-full py-4 mt-4"
              >
                Vincular Conta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 glass-card border-t border-white/10 px-2 py-2 z-40">
        <div className="flex items-center justify-around">
          {bottomNavItems.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors ${
                item.active 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Profile;
