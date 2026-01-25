import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  Wallet, 
  TrendingUp, 
  Users, 
  Gift, 
  Settings, 
  LogOut,
  ChevronRight,
  Bell,
  Copy,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

const menuItems = [
  { icon: Home, label: 'Início', active: true },
  { icon: Wallet, label: 'Carteira' },
  { icon: TrendingUp, label: 'Investimentos' },
  { icon: Users, label: 'Equipe' },
  { icon: Gift, label: 'Bônus' },
  { icon: Settings, label: 'Configurações' },
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
      <header className="glass-card mx-4 mt-4 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white font-bold">U</span>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Bem-vindo</p>
            <p className="font-semibold text-foreground">Usuário</p>
          </div>
        </div>
        <button className="relative p-2 rounded-full hover:bg-white/10">
          <Bell className="w-6 h-6 text-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
        </button>
      </header>

      {/* Balance Card */}
      <div className="glass-card mx-4 mt-4 p-6">
        <p className="text-sm text-muted-foreground mb-1">Saldo Disponível</p>
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Kz {balance.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
        </h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-xl p-4">
            <TrendingUp className="w-5 h-5 text-success mb-2" />
            <p className="text-xs text-muted-foreground">Total Investido</p>
            <p className="font-semibold text-foreground">
              Kz {totalInvested.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <Gift className="w-5 h-5 text-warning mb-2" />
            <p className="text-xs text-muted-foreground">Total Ganhos</p>
            <p className="font-semibold text-foreground">
              Kz {totalEarnings.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mx-4 mt-4">
        <button className="btn-primary py-4 flex items-center justify-center gap-2">
          <Wallet className="w-5 h-5" />
          Depositar
        </button>
        <button className="btn-outline py-4 flex items-center justify-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Sacar
        </button>
      </div>

      {/* Invite Section */}
      <div className="glass-card mx-4 mt-4 p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-semibold text-foreground">Convide amigos</p>
            <p className="text-sm text-muted-foreground">Ganhe bônus por cada indicação</p>
          </div>
          <Users className="w-8 h-8 text-primary" />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 input-dark py-2 px-4 text-sm text-muted-foreground truncate">
            {inviteCode}
          </div>
          <button
            onClick={handleCopyCode}
            className="p-3 bg-primary rounded-xl hover:bg-primary/90 transition-colors"
          >
            {copied ? (
              <CheckCircle className="w-5 h-5 text-white" />
            ) : (
              <Copy className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Menu */}
      <div className="glass-card mx-4 mt-4 mb-4 overflow-hidden">
        {menuItems.map((item, index) => (
          <button
            key={item.label}
            className={`w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors ${
              index !== menuItems.length - 1 ? 'border-b border-white/5' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <item.icon className={`w-5 h-5 ${item.active ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className={item.active ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                {item.label}
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        ))}
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-destructive"
        >
          <div className="flex items-center gap-3">
            <LogOut className="w-5 h-5" />
            <span>Sair</span>
          </div>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
