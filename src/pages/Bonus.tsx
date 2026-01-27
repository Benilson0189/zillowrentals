import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  Building2, 
  Users, 
  User,
  ArrowLeft,
  Gift,
  Calendar,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import { useTodayCheckin, useCheckinHistory, useClaimCheckin } from '@/hooks/useCheckin';
import { Button } from '@/components/ui/button';

const bottomNavItems = [
  { icon: Home, label: 'Início', path: '/dashboard' },
  { icon: Building2, label: 'Alugar', path: '/rentals' },
  { icon: Users, label: 'Equipe', path: '/team' },
  { icon: User, label: 'Perfil', path: '/profile' },
];

const Bonus: React.FC = () => {
  const navigate = useNavigate();
  const { data: todayCheckin, isLoading: checkingToday } = useTodayCheckin();
  const { data: history = [], isLoading: loadingHistory } = useCheckinHistory();
  const claimMutation = useClaimCheckin();

  const hasCheckedInToday = !!todayCheckin;

  const handleClaim = async () => {
    try {
      const result = await claimMutation.mutateAsync();
      toast.success(`Parabéns! Você ganhou ${result.bonusKz} Kz de bônus!`);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer check-in');
    }
  };

  // Get last 7 days for display
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  });

  const checkinDates = new Set(history.map(h => h.checked_in_at));

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="glass-card mx-3 mt-3 p-3 flex items-center gap-2">
        <button onClick={() => navigate('/profile')} className="p-1.5 rounded-full hover:bg-foreground/10">
          <ArrowLeft className="w-4 h-4 text-foreground" />
        </button>
        <h1 className="text-base font-semibold text-foreground">Bônus de Check-in</h1>
      </header>

      {/* Main Bonus Card */}
      <div className="mx-3 mt-4">
        <div className="glass-card p-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-purple-500/20" />
          <div className="relative z-10">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/20 flex items-center justify-center">
              <Gift className="w-8 h-8 text-secondary" />
            </div>
            
            <h2 className="text-xl font-bold text-foreground mb-2">
              Check-in Diário
            </h2>
            
            <p className="text-sm text-muted-foreground mb-4">
              Faça check-in todos os dias e ganhe bônus de 10 a 50 Kz!
            </p>

            {checkingToday ? (
              <div className="py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary mx-auto" />
              </div>
            ) : hasCheckedInToday ? (
              <div className="py-4">
                <div className="inline-flex items-center gap-2 bg-success/20 text-success px-4 py-2 rounded-full">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Check-in feito!</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Você ganhou {todayCheckin?.bonus_amount} Kz hoje
                </p>
              </div>
            ) : (
              <Button
                onClick={handleClaim}
                disabled={claimMutation.isPending}
                className="w-full max-w-xs bg-secondary hover:bg-secondary/90"
              >
                {claimMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Processando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Fazer Check-in
                  </span>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Weekly Calendar */}
      <div className="mx-3 mt-4">
        <h3 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Últimos 7 dias
        </h3>
        <div className="glass-card p-3">
          <div className="grid grid-cols-7 gap-2">
            {last7Days.reverse().map((date, index) => {
              const isChecked = checkinDates.has(date);
              const isToday = date === new Date().toISOString().split('T')[0];
              const dayName = new Date(date).toLocaleDateString('pt-AO', { weekday: 'short' });
              const dayNum = new Date(date).getDate();
              
              return (
                <div
                  key={date}
                  className={`flex flex-col items-center p-2 rounded-lg ${
                    isToday ? 'bg-secondary/20 ring-2 ring-secondary' : 'bg-foreground/5'
                  }`}
                >
                  <span className="text-[10px] text-muted-foreground uppercase">{dayName}</span>
                  <span className="text-sm font-medium text-foreground">{dayNum}</span>
                  {isChecked ? (
                    <CheckCircle className="w-4 h-4 text-success mt-1" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-muted-foreground/30 mt-1" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* History */}
      <div className="mx-3 mt-4">
        <h3 className="text-sm font-medium text-foreground mb-2">Histórico de Bônus</h3>
        
        {loadingHistory ? (
          <div className="glass-card p-4 flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-secondary" />
          </div>
        ) : history.length === 0 ? (
          <div className="glass-card p-4 text-center">
            <p className="text-sm text-muted-foreground">Nenhum check-in ainda</p>
          </div>
        ) : (
          <div className="space-y-2">
            {history.slice(0, 10).map((item) => (
              <div key={item.id} className="glass-card p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-secondary" />
                  <span className="text-sm text-foreground">
                    {new Date(item.checked_in_at).toLocaleDateString('pt-AO', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <span className="text-sm font-medium text-success">
                  +{item.bonus_amount} Kz
                </span>
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
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors text-muted-foreground hover:text-foreground"
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

export default Bonus;
