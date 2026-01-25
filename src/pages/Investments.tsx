import React, { useState } from 'react';
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

const bottomNavItems = [
  { icon: Home, label: 'Início', path: '/dashboard' },
  { icon: TrendingUp, label: 'Investimentos', path: '/investments', active: true },
  { icon: Users, label: 'Equipe', path: '/team' },
  { icon: User, label: 'Perfil', path: '/profile' },
];

const investmentPlans = [
  {
    id: 1,
    name: 'Plano Básico',
    minAmount: 5000,
    maxAmount: 50000,
    dailyReturn: 2.5,
    duration: 30,
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 2,
    name: 'Plano Prata',
    minAmount: 50000,
    maxAmount: 200000,
    dailyReturn: 3.0,
    duration: 45,
    color: 'from-slate-400 to-slate-500',
  },
  {
    id: 3,
    name: 'Plano Ouro',
    minAmount: 200000,
    maxAmount: 500000,
    dailyReturn: 3.5,
    duration: 60,
    color: 'from-yellow-500 to-yellow-600',
  },
  {
    id: 4,
    name: 'Plano Diamante',
    minAmount: 500000,
    maxAmount: 2000000,
    dailyReturn: 4.0,
    duration: 90,
    color: 'from-purple-500 to-purple-600',
  },
  {
    id: 5,
    name: 'Plano VIP',
    minAmount: 2000000,
    maxAmount: 10000000,
    dailyReturn: 5.0,
    duration: 120,
    color: 'from-primary to-blue-400',
  },
];

const Investments: React.FC = () => {
  const navigate = useNavigate();

  const handleInvest = (planId: number) => {
    toast.info('Funcionalidade de investimento em breve!');
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="glass-card mx-4 mt-4 p-4 flex items-center gap-3">
        <button onClick={() => navigate('/dashboard')} className="p-2 rounded-full hover:bg-white/10">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Planos de Investimento</h1>
      </header>

      {/* Investment Plans */}
      <div className="mx-4 mt-4 space-y-4">
        {investmentPlans.map((plan) => (
          <div key={plan.id} className="glass-card p-4 overflow-hidden">
            {/* Plan Header */}
            <div className={`bg-gradient-to-r ${plan.color} -mx-4 -mt-4 px-4 py-3 mb-4`}>
              <h3 className="text-lg font-bold text-white">{plan.name}</h3>
            </div>

            {/* Plan Details */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Percent className="w-4 h-4 text-success" />
                </div>
                <p className="text-lg font-bold text-foreground">{plan.dailyReturn}%</p>
                <p className="text-xs text-muted-foreground">Rendimento/dia</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Clock className="w-4 h-4 text-warning" />
                </div>
                <p className="text-lg font-bold text-foreground">{plan.duration}</p>
                <p className="text-xs text-muted-foreground">Dias</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                <p className="text-lg font-bold text-foreground">
                  {((plan.dailyReturn / 100) * plan.duration * 100).toFixed(0)}%
                </p>
                <p className="text-xs text-muted-foreground">Retorno Total</p>
              </div>
            </div>

            {/* Amount Range */}
            <div className="bg-white/5 rounded-xl p-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Mínimo:</span>
                <span className="text-foreground font-medium">
                  Kz {plan.minAmount.toLocaleString('pt-AO')}
                </span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-muted-foreground">Máximo:</span>
                <span className="text-foreground font-medium">
                  Kz {plan.maxAmount.toLocaleString('pt-AO')}
                </span>
              </div>
            </div>

            {/* Invest Button */}
            <button
              onClick={() => handleInvest(plan.id)}
              className="w-full btn-primary py-3"
            >
              Investir Agora
            </button>
          </div>
        ))}
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

export default Investments;
