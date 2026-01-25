import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  TrendingUp, 
  Users, 
  User,
  ArrowLeft,
  Copy,
  CheckCircle,
  UserCheck,
  UserX,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { toast } from 'sonner';

const bottomNavItems = [
  { icon: Home, label: 'Início', path: '/dashboard' },
  { icon: TrendingUp, label: 'Investimentos', path: '/investments' },
  { icon: Users, label: 'Equipe', path: '/team', active: true },
  { icon: User, label: 'Perfil', path: '/profile' },
];

// Mock data - será substituído por dados reais do banco
const teamStats = {
  level1: { total: 12, active: 8 },
  levelB: { total: 45, active: 28 },
  levelC: { total: 120, active: 67 },
};

const invitedUsers = [
  {
    id: 'USR001',
    name: 'João Silva',
    phone: '+244 9** *** **4',
    level: 1,
    isActive: true,
    activeInvestments: [
      { plan: 'Plano Ouro', amount: 250000, dailyReturn: 3.5 },
    ],
    joinedAt: '2024-01-15',
  },
  {
    id: 'USR002',
    name: 'Maria Santos',
    phone: '+244 9** *** **8',
    level: 1,
    isActive: true,
    activeInvestments: [
      { plan: 'Plano Prata', amount: 100000, dailyReturn: 3.0 },
      { plan: 'Plano Básico', amount: 20000, dailyReturn: 2.5 },
    ],
    joinedAt: '2024-01-20',
  },
  {
    id: 'USR003',
    name: 'Pedro Nunes',
    phone: '+244 9** *** **2',
    level: 1,
    isActive: false,
    activeInvestments: [],
    joinedAt: '2024-02-01',
  },
  {
    id: 'USR004',
    name: 'Ana Costa',
    phone: '+244 9** *** **6',
    level: 2,
    isActive: true,
    activeInvestments: [
      { plan: 'Plano Diamante', amount: 600000, dailyReturn: 4.0 },
    ],
    joinedAt: '2024-01-25',
  },
  {
    id: 'USR005',
    name: 'Carlos Mendes',
    phone: '+244 9** *** **1',
    level: 3,
    isActive: true,
    activeInvestments: [
      { plan: 'Plano VIP', amount: 3000000, dailyReturn: 5.0 },
    ],
    joinedAt: '2024-02-10',
  },
];

const Team: React.FC = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [filterLevel, setFilterLevel] = useState<number | null>(null);

  const inviteCode = 'ABC123XYZ';
  const inviteLink = `https://app.exemplo.com/register?inviteCode=${inviteCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    toast.success('Link copiado!');
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredUsers = filterLevel 
    ? invitedUsers.filter(u => u.level === filterLevel)
    : invitedUsers;

  const totalActive = teamStats.level1.active + teamStats.levelB.active + teamStats.levelC.active;
  const totalInvited = teamStats.level1.total + teamStats.levelB.total + teamStats.levelC.total;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="glass-card mx-4 mt-4 p-4 flex items-center gap-3">
        <button onClick={() => navigate('/dashboard')} className="p-2 rounded-full hover:bg-white/10">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Minha Equipe</h1>
      </header>

      {/* Invite Link */}
      <div className="glass-card mx-4 mt-4 p-4">
        <p className="text-sm text-muted-foreground mb-2">Seu link de convite</p>
        <div className="flex items-center gap-2">
          <div className="flex-1 input-dark py-2 px-4 text-sm text-muted-foreground truncate">
            {inviteLink}
          </div>
          <button
            onClick={handleCopyLink}
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

      {/* Team Stats */}
      <div className="mx-4 mt-4 grid grid-cols-2 gap-3">
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <UserCheck className="w-5 h-5 text-success" />
            <span className="text-sm text-muted-foreground">Ativos</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{totalActive}</p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Total</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{totalInvited}</p>
        </div>
      </div>

      {/* Level Stats */}
      <div className="mx-4 mt-4 grid grid-cols-3 gap-3">
        <button
          onClick={() => setFilterLevel(filterLevel === 1 ? null : 1)}
          className={`glass-card p-3 text-center transition-colors ${filterLevel === 1 ? 'ring-2 ring-primary' : ''}`}
        >
          <p className="text-xs text-muted-foreground mb-1">Nível 1</p>
          <p className="text-lg font-bold text-foreground">{teamStats.level1.total}</p>
          <p className="text-xs text-success">{teamStats.level1.active} ativos</p>
        </button>
        <button
          onClick={() => setFilterLevel(filterLevel === 2 ? null : 2)}
          className={`glass-card p-3 text-center transition-colors ${filterLevel === 2 ? 'ring-2 ring-primary' : ''}`}
        >
          <p className="text-xs text-muted-foreground mb-1">Nível B</p>
          <p className="text-lg font-bold text-foreground">{teamStats.levelB.total}</p>
          <p className="text-xs text-success">{teamStats.levelB.active} ativos</p>
        </button>
        <button
          onClick={() => setFilterLevel(filterLevel === 3 ? null : 3)}
          className={`glass-card p-3 text-center transition-colors ${filterLevel === 3 ? 'ring-2 ring-primary' : ''}`}
        >
          <p className="text-xs text-muted-foreground mb-1">Nível C</p>
          <p className="text-lg font-bold text-foreground">{teamStats.levelC.total}</p>
          <p className="text-xs text-success">{teamStats.levelC.active} ativos</p>
        </button>
      </div>

      {/* Invited Users List */}
      <div className="mx-4 mt-4">
        <h2 className="text-lg font-semibold text-foreground mb-3">
          Convidados {filterLevel ? `(Nível ${filterLevel === 1 ? '1' : filterLevel === 2 ? 'B' : 'C'})` : ''}
        </h2>
        
        <div className="space-y-3">
          {filteredUsers.map((user) => (
            <div key={user.id} className="glass-card overflow-hidden">
              <button
                onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
                className="w-full p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    user.isActive ? 'bg-success/20' : 'bg-muted/20'
                  }`}>
                    {user.isActive ? (
                      <UserCheck className="w-5 h-5 text-success" />
                    ) : (
                      <UserX className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">ID: {user.id} • Nível {user.level === 1 ? '1' : user.level === 2 ? 'B' : 'C'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {user.isActive && (
                    <span className="text-xs bg-success/20 text-success px-2 py-1 rounded-full">
                      Ativo
                    </span>
                  )}
                  {expandedUser === user.id ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </button>

              {/* Expanded Details */}
              {expandedUser === user.id && (
                <div className="px-4 pb-4 border-t border-white/5 pt-3">
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Telefone:</span>
                      <span className="text-foreground">{user.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cadastro:</span>
                      <span className="text-foreground">{user.joinedAt}</span>
                    </div>
                  </div>

                  {user.activeInvestments.length > 0 ? (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-foreground mb-2">Investimentos Ativos:</p>
                      <div className="space-y-2">
                        {user.activeInvestments.map((inv, idx) => (
                          <div key={idx} className="bg-white/5 rounded-lg p-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-foreground">{inv.plan}</span>
                              <span className="text-xs text-success">{inv.dailyReturn}%/dia</span>
                            </div>
                            <p className="text-sm text-primary mt-1">
                              Kz {inv.amount.toLocaleString('pt-AO')}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 bg-white/5 rounded-lg p-3 text-center">
                      <p className="text-sm text-muted-foreground">Sem investimentos ativos</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 glass-card border-t border-white/10 px-2 py-2 z-50">
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

export default Team;
