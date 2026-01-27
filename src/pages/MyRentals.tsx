import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  Building2, 
  Users, 
  User,
  ArrowLeft,
  Calendar,
  DollarSign,
  Clock,
  MapPin
} from 'lucide-react';
import { useUserInvestments } from '@/hooks/useUserData';

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
  { icon: Building2, label: 'Alugar', path: '/rentals' },
  { icon: Users, label: 'Equipe', path: '/team' },
  { icon: User, label: 'Perfil', path: '/profile' },
];

const MyRentals: React.FC = () => {
  const navigate = useNavigate();
  const { data: investments, isLoading } = useUserInvestments();

  const activeInvestments = investments?.filter(inv => inv.status === 'active') || [];
  const completedInvestments = investments?.filter(inv => inv.status !== 'active') || [];

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
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
        <h1 className="text-base font-semibold text-foreground">Meus Aluguéis</h1>
      </header>

      {/* Active Rentals */}
      <div className="mx-3 mt-3">
        <h2 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
          <Clock className="w-4 h-4 text-success" />
          Aluguéis Ativos ({activeInvestments.length})
        </h2>
        
        {activeInvestments.length === 0 ? (
          <div className="glass-card p-6 text-center">
            <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-3">Você ainda não tem aluguéis ativos</p>
            <button 
              onClick={() => navigate('/rentals')}
              className="btn-primary text-sm"
            >
              Ver Propriedades
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {activeInvestments.map((investment) => {
              const plan = investment.plan;
              const propertyImage = propertyImages[Number(investment.amount)] || property1;
              const daysRemaining = getDaysRemaining(investment.end_date);
              const startDate = new Date(investment.start_date);
              
              const formatFullDate = (date: Date) => {
                const day = date.getDate().toString().padStart(2, '0');
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const year = date.getFullYear();
                const hours = date.getHours().toString().padStart(2, '0');
                const minutes = date.getMinutes().toString().padStart(2, '0');
                const seconds = date.getSeconds().toString().padStart(2, '0');
                return `${day}/${month}/${year} às ${hours}:${minutes}:${seconds}`;
              };
              
              return (
                <div key={investment.id} className="glass-card overflow-hidden">
                  <div className="flex">
                    {/* Property Image */}
                    <div className="w-24 h-24 flex-shrink-0">
                      <img 
                        src={propertyImage} 
                        alt={plan?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Details */}
                    <div className="flex-1 p-3">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <h3 className="text-sm font-semibold text-foreground">{plan?.name}</h3>
                          <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            Premium Location
                          </p>
                        </div>
                        <span className="text-[10px] bg-success/20 text-success px-2 py-0.5 rounded-full">
                          Ativo
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3 text-secondary" />
                          <span className="text-xs text-foreground">
                            $ {Number(investment.amount).toLocaleString('en-US')}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-warning" />
                          <span className="text-xs text-foreground">
                            {daysRemaining} dias restantes
                          </span>
                        </div>
                      </div>
                      
                      {/* Full timestamp */}
                      <div className="mt-2 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground">
                          Investido em: {formatFullDate(startDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Completed Rentals */}
      {completedInvestments.length > 0 && (
        <div className="mx-3 mt-4">
          <h2 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            Histórico ({completedInvestments.length})
          </h2>
          
          <div className="space-y-2">
            {completedInvestments.map((investment) => {
              const plan = investment.plan;
              
              return (
                <div key={investment.id} className="glass-card p-3 opacity-70">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-foreground">{plan?.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        $ {Number(investment.amount).toLocaleString('en-US')}
                      </p>
                    </div>
                    <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                      Concluído
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

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

export default MyRentals;
