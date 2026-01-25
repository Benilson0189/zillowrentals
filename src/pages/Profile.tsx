import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  TrendingUp, 
  Users,
  User,
  ChevronRight,
  LogOut,
  Bell,
  ArrowDownCircle,
  ArrowUpCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useProfile, useBalance } from '@/hooks/useUserData';

const bottomNavItems = [
  { icon: Home, label: 'Início', path: '/dashboard', active: false },
  { icon: TrendingUp, label: 'Investimentos', path: '/investments', active: false },
  { icon: Users, label: 'Equipe', path: '/team', active: false },
  { icon: User, label: 'Perfil', path: '/profile', active: true },
];

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { data: profile } = useProfile();
  const { data: balanceData } = useBalance();
  
  const balance = balanceData?.balance || 0;

  const handleLogout = async () => {
    await signOut();
    toast.success('Sessão encerrada');
    navigate('/login');
  };

  const menuItems = [
    {
      icon: ArrowDownCircle,
      label: 'Depositar',
      value: '',
      color: 'text-success',
      onClick: () => navigate('/deposit'),
    },
    {
      icon: ArrowUpCircle,
      label: 'Sacar',
      value: '',
      color: 'text-warning',
      onClick: () => navigate('/withdrawal'),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-card mx-3 mt-3 p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-sm">
              {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {profile?.full_name || 'Usuário'}
            </p>
            <p className="text-xs text-muted-foreground">{profile?.phone}</p>
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
          Kz {Number(balance).toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
        </h2>
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
