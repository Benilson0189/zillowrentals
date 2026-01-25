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
  Zap,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { useInvestmentPlans, useBalance } from '@/hooks/useUserData';
import { useCreateInvestment } from '@/hooks/useInvestment';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const bottomNavItems = [
  { icon: Home, label: 'Início', path: '/dashboard' },
  { icon: TrendingUp, label: 'Investimentos', path: '/investments', active: true },
  { icon: Users, label: 'Equipe', path: '/team' },
  { icon: User, label: 'Perfil', path: '/profile' },
];

interface Plan {
  id: string;
  name: string;
  min_amount: number;
  max_amount: number;
  daily_return: number;
  duration_days: number;
  color_class: string | null;
}

const Investments: React.FC = () => {
  const navigate = useNavigate();
  const { data: plans, isLoading } = useInvestmentPlans();
  const { data: balance } = useBalance();
  const createInvestment = useCreateInvestment();
  
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const handleInvest = (plan: Plan) => {
    const availableBalance = balance?.balance || 0;
    
    if (availableBalance < plan.min_amount) {
      toast.error(`Saldo insuficiente. Você precisa de Kz ${Number(plan.min_amount).toLocaleString('pt-AO')}`);
      return;
    }
    
    setSelectedPlan(plan);
    setShowConfirmDialog(true);
  };

  const confirmInvestment = async () => {
    if (!selectedPlan) return;

    try {
      await createInvestment.mutateAsync({
        planId: selectedPlan.id,
        amount: selectedPlan.min_amount,
        durationDays: selectedPlan.duration_days,
      });
      setShowConfirmDialog(false);
      setShowSuccessDialog(true);
    } catch (error) {
      toast.error('Erro ao criar investimento');
    }
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
                  <Zap className="w-3 h-3 text-success" />
                </div>
                <p className="text-sm font-bold text-foreground">
                  Kz {((Number(plan.daily_return) / 100) * Number(plan.min_amount)).toLocaleString('pt-AO')}
                </p>
                <p className="text-[10px] text-muted-foreground">Renda/dia</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-0.5">
                  <Clock className="w-3 h-3 text-warning" />
                </div>
                <p className="text-sm font-bold text-foreground">{plan.duration_days} dias</p>
                <p className="text-[10px] text-muted-foreground">Duração</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-0.5">
                  <Percent className="w-3 h-3 text-secondary" />
                </div>
                <p className="text-sm font-bold text-foreground">
                  Kz {(((Number(plan.daily_return) / 100) * Number(plan.min_amount)) * plan.duration_days).toLocaleString('pt-AO')}
                </p>
                <p className="text-[10px] text-muted-foreground">Retorno Total</p>
              </div>
            </div>

            {/* Investment Amount */}
            <div className="bg-foreground/5 rounded-lg p-2 mb-3">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Investimento:</span>
                <span className="text-foreground font-medium">
                  Kz {Number(plan.min_amount).toLocaleString('pt-AO')}
                </span>
              </div>
            </div>

            {/* Invest Button */}
            <button
              onClick={() => handleInvest(plan as Plan)}
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

      {/* Confirm Investment Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="glass-card border-foreground/10">
          <DialogHeader>
            <DialogTitle className="text-foreground">Confirmar Investimento</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Você está prestes a investir no plano {selectedPlan?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedPlan && (
            <div className="space-y-3 mt-2">
              <div className="bg-foreground/5 rounded-lg p-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Plano:</span>
                  <span className="text-foreground font-medium">{selectedPlan.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Investimento:</span>
                  <span className="text-foreground font-medium">
                    Kz {Number(selectedPlan.min_amount).toLocaleString('pt-AO')}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Duração:</span>
                  <span className="text-foreground font-medium">{selectedPlan.duration_days} dias</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Retorno Total:</span>
                  <span className="text-success font-medium">
                    Kz {(((Number(selectedPlan.daily_return) / 100) * Number(selectedPlan.min_amount)) * selectedPlan.duration_days).toLocaleString('pt-AO')}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowConfirmDialog(false)}
                  className="btn-outline flex-1"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmInvestment}
                  disabled={createInvestment.isPending}
                  className="btn-primary flex-1 disabled:opacity-50"
                >
                  {createInvestment.isPending ? 'Processando...' : 'Confirmar'}
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="glass-card border-foreground/10 text-center">
          <div className="py-4">
            <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Investimento Realizado!</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Seu investimento no plano {selectedPlan?.name} foi criado com sucesso.
            </p>
            <button
              onClick={() => {
                setShowSuccessDialog(false);
                navigate('/dashboard');
              }}
              className="btn-primary"
            >
              Voltar ao Início
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Investments;
