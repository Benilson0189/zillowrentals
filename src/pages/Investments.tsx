import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  TrendingUp, 
  Users, 
  User,
  ArrowLeft,
  Clock,
  Percent,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';
import { useInvestmentPlans } from '@/hooks/useUserData';

const bottomNavItems = [
  { icon: Home, label: 'Início', path: '/dashboard' },
  { icon: TrendingUp, label: 'Investimentos', path: '/investments', active: true },
  { icon: Users, label: 'Equipe', path: '/team' },
  { icon: User, label: 'Perfil', path: '/profile' },
];

const Investments: React.FC = () => {
  const navigate = useNavigate();
  const { data: plans, isLoading } = useInvestmentPlans();

  const handleInvest = (planId: string) => {
    toast.info('Funcionalidade de investimento em breve!');
  };

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
        <h1 className="text-base font-semibold text-foreground">Planos de Investimento</h1>
      </header>

      {/* Investment Plans */}
      <div className="mx-3 mt-3 space-y-3">
        {plans?.map((plan) => (
          <div key={plan.id} className="glass-card p-3 overflow-hidden">
            {/* Plan Header */}
            <div className={`bg-gradient-to-r ${plan.color_class || 'from-blue-500 to-blue-600'} -mx-3 -mt-3 px-3 py-2 mb-3`}>
              <h3 className="text-sm font-semibold text-white">{plan.name}</h3>
            </div>

            {/* Plan Details */}
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="text-center">
                <div className="flex items-center justify-center mb-0.5">
                  <Percent className="w-3 h-3 text-success" />
                </div>
                <p className="text-sm font-bold text-foreground">{Number(plan.daily_return)}%</p>
                <p className="text-[10px] text-muted-foreground">Rendimento/dia</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-0.5">
                  <Clock className="w-3 h-3 text-warning" />
                </div>
                <p className="text-sm font-bold text-foreground">{plan.duration_days}</p>
                <p className="text-[10px] text-muted-foreground">Dias</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-0.5">
                  <Zap className="w-3 h-3 text-secondary" />
                </div>
                <p className="text-sm font-bold text-foreground">
                  {((Number(plan.daily_return) / 100) * plan.duration_days * 100).toFixed(0)}%
                </p>
                <p className="text-[10px] text-muted-foreground">Retorno Total</p>
              </div>
            </div>

            {/* Amount Range */}
            <div className="bg-foreground/5 rounded-lg p-2 mb-3">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Mínimo:</span>
                <span className="text-foreground font-medium">
                  Kz {Number(plan.min_amount).toLocaleString('pt-AO')}
                </span>
              </div>
              <div className="flex justify-between text-xs mt-0.5">
                <span className="text-muted-foreground">Máximo:</span>
                <span className="text-foreground font-medium">
                  Kz {Number(plan.max_amount).toLocaleString('pt-AO')}
                </span>
              </div>
            </div>

            {/* Invest Button */}
            <button
              onClick={() => handleInvest(plan.id)}
              className="w-full btn-primary py-2"
            >
              Investir Agora
            </button>
          </div>
        ))}
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

export default Investments;
