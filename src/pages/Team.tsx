import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  Building2, 
  Users, 
  User,
  ArrowLeft,
  Copy,
  CheckCircle,
  UserCheck,
  UserX,
  ChevronDown,
  ChevronUp,
  Share2
} from 'lucide-react';
import { toast } from 'sonner';
import { useProfile, useTeamMembers } from '@/hooks/useUserData';

const bottomNavItems = [
  { icon: Home, label: 'Início', path: '/dashboard' },
  { icon: Building2, label: 'Alugar', path: '/rentals' },
  { icon: Users, label: 'Equipe', path: '/team', active: true },
  { icon: User, label: 'Perfil', path: '/profile' },
];

const Team: React.FC = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [filterLevel, setFilterLevel] = useState<number | null>(null);

  const { data: profile } = useProfile();
  const { data: teamData, isLoading } = useTeamMembers();

  const inviteCode = profile?.invite_code || '';
  const inviteLink = `${window.location.origin}/register?inviteCode=${inviteCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    toast.success('Link copiado!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCode = () => {
    if (inviteCode) {
      navigator.clipboard.writeText(inviteCode);
      toast.success('Código copiado!');
    }
  };

  const level1 = teamData?.level1 || [];
  const levelB = teamData?.levelB || [];
  const levelC = teamData?.levelC || [];

  const totalActive = 0; // Would need to check investments for each user
  const totalInvited = level1.length + levelB.length + levelC.length;

  const getFilteredUsers = () => {
    if (filterLevel === 1) return level1.map(u => ({ ...u, level: 1 }));
    if (filterLevel === 2) return levelB.map(u => ({ ...u, level: 2 }));
    if (filterLevel === 3) return levelC.map(u => ({ ...u, level: 3 }));
    return [
      ...level1.map(u => ({ ...u, level: 1 })),
      ...levelB.map(u => ({ ...u, level: 2 })),
      ...levelC.map(u => ({ ...u, level: 3 })),
    ];
  };

  const filteredUsers = getFilteredUsers();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="glass-card mx-3 mt-3 p-3 flex items-center gap-2">
        <button onClick={() => navigate('/dashboard')} className="p-1.5 rounded-full hover:bg-foreground/10">
          <ArrowLeft className="w-4 h-4 text-foreground" />
        </button>
        <h1 className="text-base font-semibold text-foreground">Minha Equipe</h1>
      </header>

      {/* Invite Code Card */}
      <div className="glass-card mx-3 mt-3 p-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-secondary" />
            <div>
              <p className="text-xs text-muted-foreground">Seu código de convite</p>
              <p className="text-lg font-bold text-foreground">{inviteCode || '---'}</p>
            </div>
          </div>
          <button 
            onClick={handleCopyCode}
            className="p-2 rounded-lg bg-secondary/10 text-secondary hover:bg-secondary/20"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
        
        <p className="text-xs text-muted-foreground mb-1.5">Link de convite</p>
        <div className="flex items-center gap-2">
          <div className="flex-1 input-dark py-1.5 px-3 text-xs text-muted-foreground truncate">
            {inviteLink}
          </div>
          <button
            onClick={handleCopyLink}
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

      {/* Team Stats */}
      <div className="mx-3 mt-3 grid grid-cols-2 gap-2">
        <div className="glass-card p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <UserCheck className="w-4 h-4 text-success" />
            <span className="text-xs text-muted-foreground">Ativos</span>
          </div>
          <p className="text-xl font-bold text-foreground">{totalActive}</p>
        </div>
        <div className="glass-card p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Users className="w-4 h-4 text-secondary" />
            <span className="text-xs text-muted-foreground">Total</span>
          </div>
          <p className="text-xl font-bold text-foreground">{totalInvited}</p>
        </div>
      </div>

      {/* Level Stats */}
      <div className="mx-3 mt-3 grid grid-cols-3 gap-2">
        <button
          onClick={() => setFilterLevel(filterLevel === 1 ? null : 1)}
          className={`glass-card p-2 text-center transition-colors ${filterLevel === 1 ? 'ring-2 ring-secondary' : ''}`}
        >
          <p className="text-[10px] text-muted-foreground mb-0.5">Nível A</p>
          <p className="text-sm font-bold text-foreground">{level1.length}</p>
          <p className="text-[10px] text-success">20% comissão</p>
        </button>
        <button
          onClick={() => setFilterLevel(filterLevel === 2 ? null : 2)}
          className={`glass-card p-2 text-center transition-colors ${filterLevel === 2 ? 'ring-2 ring-secondary' : ''}`}
        >
          <p className="text-[10px] text-muted-foreground mb-0.5">Nível B</p>
          <p className="text-sm font-bold text-foreground">{levelB.length}</p>
          <p className="text-[10px] text-success">3% comissão</p>
        </button>
        <button
          onClick={() => setFilterLevel(filterLevel === 3 ? null : 3)}
          className={`glass-card p-2 text-center transition-colors ${filterLevel === 3 ? 'ring-2 ring-secondary' : ''}`}
        >
          <p className="text-[10px] text-muted-foreground mb-0.5">Nível C</p>
          <p className="text-sm font-bold text-foreground">{levelC.length}</p>
          <p className="text-[10px] text-success">1% comissão</p>
        </button>
      </div>

      {/* Invited Users List */}
      <div className="mx-3 mt-3">
        <h2 className="text-sm font-medium text-foreground mb-2">
          Convidados {filterLevel ? `(Nível ${filterLevel === 1 ? 'A' : filterLevel === 2 ? 'B' : 'C'})` : ''}
        </h2>
        
        {filteredUsers.length === 0 ? (
          <div className="glass-card p-4 text-center">
            <p className="text-sm text-muted-foreground">Nenhum convidado ainda</p>
            <p className="text-xs text-muted-foreground mt-1">Compartilhe seu link para convidar amigos!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredUsers.map((user) => (
              <div key={user.id} className="glass-card overflow-hidden">
                <button
                  onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
                  className="w-full p-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-muted/20">
                      <UserX className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-foreground">
                        {user.full_name || 'Usuário'}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Nível {user.level === 1 ? 'A' : user.level === 2 ? 'B' : 'C'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {expandedUser === user.id ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {/* Expanded Details */}
                {expandedUser === user.id && (
                  <div className="px-3 pb-3 border-t border-foreground/5 pt-2">
                    <div className="text-xs space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Telefone:</span>
                        <span className="text-foreground">{user.phone || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cadastro:</span>
                        <span className="text-foreground">
                          {new Date(user.created_at).toLocaleDateString('pt-AO')}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 bg-foreground/5 rounded-lg p-2 text-center">
                      <p className="text-xs text-muted-foreground">Sem investimentos ativos</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

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

export default Team;