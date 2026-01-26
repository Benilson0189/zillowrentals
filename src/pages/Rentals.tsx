import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  Building2, 
  Users, 
  User,
  ArrowLeft,
  Clock,
  Percent,
  Zap,
  CheckCircle,
  MapPin
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

// Import property images
import property1 from '@/assets/property-1.jpg';
import property2 from '@/assets/property-2.jpg';
import property3 from '@/assets/property-3.jpg';
import property4 from '@/assets/property-4.jpg';
import property5 from '@/assets/property-5.jpg';
import property6 from '@/assets/property-6.jpg';
import property7 from '@/assets/property-7.jpg';
import property8 from '@/assets/property-8.jpg';

const propertyImages: Record<number, string> = {
  4000: property1,
  15000: property2,
  20000: property3,
  25000: property4,
  40000: property5,
  60000: property6,
  80000: property7,
  100000: property8,
};

const bottomNavItems = [
  { icon: Home, label: 'Início', path: '/dashboard' },
  { icon: Building2, label: 'Alugar', path: '/rentals', active: true },
  { icon: Users, label: 'Equipe', path: '/team' },
  { icon: User, label: 'Perfil', path: '/profile' },
];

interface Plan {
  id: string;
  name: string;
  description: string | null;
  min_amount: number;
  max_amount: number;
  daily_return: number;
  duration_days: number;
  color_class: string | null;
  image_url: string | null;
}

const Rentals: React.FC = () => {
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
      toast.error(`Saldo insuficiente. Você precisa de $ ${Number(plan.min_amount).toLocaleString('en-US')}`);
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
      toast.error('Erro ao alugar propriedade');
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
        <h1 className="text-base font-semibold text-foreground">Propriedades Disponíveis</h1>
      </header>

      {/* Rental Properties */}
      <div className="mx-3 mt-3 space-y-3">
        {plans?.map((plan) => {
          const propertyImage = propertyImages[Number(plan.min_amount)] || property1;
          return (
            <div key={plan.id} className="glass-card overflow-hidden">
              {/* Property Image */}
              <div className="relative h-36 overflow-hidden">
                <img 
                  src={propertyImage} 
                  alt={plan.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-secondary/90 text-white text-[10px] px-2 py-1 rounded-full font-medium">
                  {plan.duration_days} dias
                </div>
              </div>

              {/* Property Details */}
              <div className="p-3">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{plan.name}</h3>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {(plan as Plan).description || 'Premium Location'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-secondary">
                      $ {Number(plan.min_amount).toLocaleString('en-US')}
                    </p>
                    <p className="text-[10px] text-muted-foreground">investimento</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="bg-foreground/5 rounded-lg p-2 text-center">
                    <div className="flex items-center justify-center mb-0.5">
                      <Zap className="w-3 h-3 text-success" />
                    </div>
                    <p className="text-xs font-bold text-foreground">
                      $ {((Number(plan.daily_return) / 100) * Number(plan.min_amount)).toLocaleString('en-US')}
                    </p>
                    <p className="text-[9px] text-muted-foreground">Renda/dia</p>
                  </div>
                  <div className="bg-foreground/5 rounded-lg p-2 text-center">
                    <div className="flex items-center justify-center mb-0.5">
                      <Clock className="w-3 h-3 text-warning" />
                    </div>
                    <p className="text-xs font-bold text-foreground">{plan.duration_days}</p>
                    <p className="text-[9px] text-muted-foreground">dias</p>
                  </div>
                  <div className="bg-foreground/5 rounded-lg p-2 text-center">
                    <div className="flex items-center justify-center mb-0.5">
                      <Percent className="w-3 h-3 text-secondary" />
                    </div>
                    <p className="text-xs font-bold text-foreground">
                      $ {(((Number(plan.daily_return) / 100) * Number(plan.min_amount)) * plan.duration_days).toLocaleString('en-US')}
                    </p>
                    <p className="text-[9px] text-muted-foreground">Total</p>
                  </div>
                </div>

                {/* Rent Button */}
                <button
                  onClick={() => handleInvest(plan as Plan)}
                  className="w-full btn-primary py-2 text-sm"
                >
                  Alugar Agora
                </button>
              </div>
            </div>
          );
        })}
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

      {/* Confirm Rental Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="glass-card border-foreground/10">
          <DialogHeader>
            <DialogTitle className="text-foreground">Confirmar Aluguel</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Você está prestes a alugar: {selectedPlan?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedPlan && (
            <div className="space-y-3 mt-2">
              <div className="bg-foreground/5 rounded-lg p-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Propriedade:</span>
                  <span className="text-foreground font-medium">{selectedPlan.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Investimento:</span>
                  <span className="text-foreground font-medium">
                    $ {Number(selectedPlan.min_amount).toLocaleString('en-US')}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Período:</span>
                  <span className="text-foreground font-medium">{selectedPlan.duration_days} dias</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Retorno Total:</span>
                  <span className="text-success font-medium">
                    $ {(((Number(selectedPlan.daily_return) / 100) * Number(selectedPlan.min_amount)) * selectedPlan.duration_days).toLocaleString('en-US')}
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
            <h3 className="text-lg font-semibold text-foreground mb-2">Aluguel Confirmado!</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Você alugou a propriedade {selectedPlan?.name} com sucesso.
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

export default Rentals;
