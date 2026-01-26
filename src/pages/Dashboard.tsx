import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  Building2, 
  Users, 
  User,
  Wallet,
  Bell,
  Copy,
  CheckCircle,
  MapPin,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';
import { useProfile, useInvestmentPlans } from '@/hooks/useUserData';

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
  { icon: Home, label: 'Início', path: '/dashboard', active: true },
  { icon: Building2, label: 'Alugar', path: '/rentals' },
  { icon: Users, label: 'Equipe', path: '/team' },
  { icon: User, label: 'Perfil', path: '/profile' },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: plans, isLoading: plansLoading } = useInvestmentPlans();
  
  const inviteCode = profile?.invite_code || 'LOADING...';

  const handleCopyCode = () => {
    navigator.clipboard.writeText(`${window.location.origin}/register?inviteCode=${inviteCode}`);
    setCopied(true);
    toast.success('Link copiado!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
      </div>
    );
  }

  // Show first 4 properties as featured
  const featuredProperties = plans?.slice(0, 4) || [];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Logo Section */}
      <div className="mx-3 mt-3 glass-card p-6 flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-secondary rounded-2xl flex items-center justify-center mb-4 shadow-lg">
          <Home className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Zillow</h1>
        <span className="text-sm text-secondary font-semibold tracking-[0.3em] mt-1">RENTALS</span>
        <p className="text-xs text-muted-foreground mt-3 text-center">
          Seu portal de investimento em aluguéis nos EUA
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mx-3 mt-3">
        <button 
          onClick={() => navigate('/deposit')}
          className="btn-primary py-3 flex items-center justify-center gap-1.5"
        >
          <Wallet className="w-4 h-4" />
          <span>Depositar</span>
        </button>
        <button 
          onClick={() => navigate('/my-rentals')}
          className="btn-outline py-3 flex items-center justify-center gap-1.5"
        >
          <Building2 className="w-4 h-4" />
          <span>Meus Aluguéis</span>
        </button>
      </div>

      {/* Featured Properties Section */}
      <div className="mx-3 mt-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-foreground">Propriedades em Destaque</h3>
          <button 
            onClick={() => navigate('/rentals')}
            className="text-xs text-secondary flex items-center gap-1"
          >
            Ver todas <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        
        {plansLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-secondary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {featuredProperties.map((plan) => {
              const propertyImage = propertyImages[Number(plan.min_amount)] || property1;
              return (
                <button 
                  key={plan.id} 
                  onClick={() => navigate('/rentals')}
                  className="glass-card overflow-hidden text-left hover:border-secondary/50 transition-colors"
                >
                  <div className="relative h-20 overflow-hidden">
                    <img 
                      src={propertyImage} 
                      alt={plan.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 right-1 bg-success/90 text-white text-[8px] px-1.5 py-0.5 rounded-full font-medium">
                      {plan.daily_return}%/dia
                    </div>
                  </div>
                  <div className="p-2">
                    <h4 className="text-xs font-medium text-foreground truncate">{plan.name}</h4>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                      <MapPin className="w-2.5 h-2.5" />
                      USA
                    </p>
                    <p className="text-xs font-bold text-secondary mt-1">
                      $ {Number(plan.min_amount).toLocaleString('en-US')}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Invite Section */}
      <div className="glass-card mx-3 mt-3 p-3">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-sm font-medium text-foreground">Convide amigos</p>
            <p className="text-xs text-muted-foreground">Ganhe bônus por cada indicação</p>
          </div>
          <Users className="w-6 h-6 text-secondary" />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 input-dark py-1.5 px-3 text-xs text-muted-foreground truncate">
            {inviteCode}
          </div>
          <button
            onClick={handleCopyCode}
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

      {/* Spacer for bottom nav */}
      <div className="h-4"></div>

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

export default Dashboard;
