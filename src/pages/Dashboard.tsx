import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  Wallet, 
  TrendingUp, 
  Users, 
  User,
  Gift,
  LogOut,
  ChevronRight,
  Bell,
  Copy,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

const bottomNavItems = [
  { icon: Home, label: 'Início', path: '/dashboard', active: true },
  { icon: TrendingUp, label: 'Investimentos', path: '/investments' },
  { icon: Users, label: 'Equipe', path: '/team' },
  { icon: User, label: 'Perfil', path: '/profile' },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  
  const inviteCode = 'ABC123XYZ';
  const balance = 0.00;
  const totalInvested = 0.00;
  const totalEarnings = 0.00;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(`https://app.exemplo.com/register?inviteCode=${inviteCode}`);
    setCopied(true);
    toast.success('Link copiado!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = () => {
    toast.success('Sessão encerrada');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-card mx-3 mt-3 p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-sm">U</span>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Bem-vindo</p>
            <p className="text-sm font-medium text-foreground">Usuário</p>
          </div>
        </div>
        <button className="relative p-1.5 rounded-full hover:bg-foreground/10">
          <Bell className="w-4 h-4 text-foreground" />
          <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-destructive rounded-full"></span>
        </button>
      </header>

      {/* Balance Card */}
      <div className="glass-card mx-3 mt-3 p-4">
        <p className="text-xs text-muted-foreground mb-1">Saldo Disponível</p>
        <h2 className="text-2xl font-bold text-foreground mb-3">
          Kz {balance.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
        </h2>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-foreground/5 rounded-lg p-3">
            <TrendingUp className="w-4 h-4 text-success mb-1" />
            <p className="text-[10px] text-muted-foreground">Total Investido</p>
            <p className="text-sm font-medium text-foreground">
              Kz {totalInvested.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-foreground/5 rounded-lg p-3">
            <Gift className="w-4 h-4 text-warning mb-1" />
            <p className="text-[10px] text-muted-foreground">Total Ganhos</p>
            <p className="text-sm font-medium text-foreground">
              Kz {totalEarnings.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mx-3 mt-3">
        <button className="btn-primary py-3 flex items-center justify-center gap-1.5">
          <Wallet className="w-4 h-4" />
          <span>Depositar</span>
        </button>
        <button className="btn-outline py-3 flex items-center justify-center gap-1.5">
          <TrendingUp className="w-4 h-4" />
          <span>Sacar</span>
        </button>
      </div>

      {/* Invite Section */}
      <div className="glass-card mx-3 mt-3 p-3">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-sm font-medium text-foreground">Convide amigos</p>
            <p className="text-xs text-muted-foreground">Ganhe bônus por cada indicação</p>
          </div>
          <Users className="w-6 h-6 text-secondary" />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 input-dark py-1.5 px-3 text-xs text-muted-foreground truncate">
            {inviteCode}
          </div>
          <button
            onClick={handleCopyCode}
            className="p-2 bg-secondary rounded-lg hover:bg-secondary/90 transition-colors"
          >
            {copied ? (
              <CheckCircle className="w-4 h-4 text-white" />
            ) : (
              <Copy className="w-4 h-4 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Spacer for bottom nav */}
      <div className="h-20"></div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 glass-card border-t border-foreground/10 px-2 py-1.5 z-50">
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

export default Dashboard;
