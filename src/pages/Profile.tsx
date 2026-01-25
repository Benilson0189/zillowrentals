import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  TrendingUp, 
  Users,
  TrendingUp as TrendingUpIcon,
  User,
  Settings,
  Wallet,
  Gift,
  ChevronRight,
  LogOut,
  Bell,
  ArrowDownCircle,
  ArrowUpCircle,
  UserCircle
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
      icon: Gift,
      label: 'Ganhos por Comissões',
      value: `Kz ${userData.commissionEarnings.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}`,
      color: 'text-warning',
      onClick: () => {},
    },
    {
      icon: ArrowUpCircle,
      label: 'Registro de Saque',
      value: '',
      color: 'text-destructive',
      onClick: () => {},
    },
    {
      icon: ArrowDownCircle,
      label: 'Registro de Depósito',
      value: '',
      color: 'text-success',
      onClick: () => {},
    },
    {
      icon: UserCircle,
      label: 'Informações Pessoais',
      value: '',
      color: 'text-secondary',
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
      <header className="glass-card mx-3 mt-3 p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-sm">
              {userData.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{userData.name}</p>
            <p className="text-xs text-muted-foreground">{userData.phone}</p>
          </div>
        </div>
        <button className="relative p-1.5 rounded-full hover:bg-foreground/10">
          <Bell className="w-4 h-4 text-foreground" />
        </button>
      </header>

      {/* Balance Summary Card */}
      <div className="glass-card mx-3 mt-3 p-4">
        <p className="text-xs text-muted-foreground mb-1">Saldo Total Disponível</p>
        <h2 className="text-2xl font-bold text-foreground mb-3">
          Kz {userData.balance.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
        </h2>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-foreground/5 rounded-lg p-3">
            <TrendingUp className="w-4 h-4 text-secondary mb-1" />
            <p className="text-[10px] text-muted-foreground">Total Ganhos</p>
            <p className="text-sm font-medium text-foreground">
              Kz {userData.totalEarnings.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-foreground/5 rounded-lg p-3">
            <Gift className="w-4 h-4 text-warning mb-1" />
            <p className="text-[10px] text-muted-foreground">Comissões</p>
            <p className="text-sm font-medium text-foreground">
              Kz {userData.commissionEarnings.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
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
              <span className="text-sm font-medium text-foreground">{item.label}</span>
            </div>
            <div className="flex items-center gap-1.5">
              {item.value && (
                <span className={`text-xs ${item.color}`}>{item.value}</span>
              )}
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </button>
        ))}
      </div>

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

      {/* Spacer for bottom nav */}
      <div className="h-20"></div>

      {/* Personal Info Modal */}
      {showBankModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-3">
          <div className="glass-card w-full max-w-md p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-foreground">Informações Pessoais</h3>
              <button 
                onClick={() => setShowBankModal(false)}
                className="p-1.5 hover:bg-foreground/10 rounded-full"
              >
                <ChevronRight className="w-4 h-4 text-foreground rotate-180" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-muted-foreground mb-1.5">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  value={bankData.bankName}
                  onChange={(e) => setBankData({ ...bankData, bankName: e.target.value })}
                  placeholder="Seu nome completo"
                  className="input-dark w-full"
                />
              </div>

              <div>
                <label className="block text-xs text-muted-foreground mb-1.5">
                  Email *
                </label>
                <input
                  type="email"
                  value={bankData.accountNumber}
                  onChange={(e) => setBankData({ ...bankData, accountNumber: e.target.value })}
                  placeholder="seu@email.com"
                  className="input-dark w-full"
                />
              </div>

              <div>
                <label className="block text-xs text-muted-foreground mb-1.5">
                  BI/Passaporte
                </label>
                <input
                  type="text"
                  value={bankData.iban}
                  onChange={(e) => setBankData({ ...bankData, iban: e.target.value })}
                  placeholder="Número do documento"
                  className="input-dark w-full"
                />
              </div>

              <button
                onClick={handleLinkBank}
                className="btn-primary w-full py-2.5 mt-3"
              >
                Salvar Informações
              </button>
            </div>
          </div>
        </div>
      )}

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
