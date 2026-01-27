import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Building2, Users, User, Globe, Shield, TrendingUp, Award } from 'lucide-react';
import zillowLogo from '@/assets/zillow-rentals-logo.jpg';

const bottomNavItems = [
  { icon: Home, label: 'Início', path: '/dashboard' },
  { icon: Building2, label: 'Alugar', path: '/rentals' },
  { icon: Users, label: 'Equipe', path: '/team' },
  { icon: User, label: 'Perfil', path: '/profile' },
];

const features = [
  {
    icon: Globe,
    title: 'Alcance Global',
    description: 'Investimentos em propriedades premium nos Estados Unidos',
  },
  {
    icon: Shield,
    title: 'Segurança',
    description: 'Transações protegidas com criptografia de ponta',
  },
  {
    icon: TrendingUp,
    title: 'Retornos Diários',
    description: 'Ganhos consistentes com aluguéis de propriedades',
  },
  {
    icon: Award,
    title: 'Confiabilidade',
    description: 'Mais de 10.000 investidores satisfeitos',
  },
];

const AboutUs: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="glass-card mx-3 mt-3 p-3 flex items-center gap-2">
        <button onClick={() => navigate('/profile')} className="p-1.5 rounded-full hover:bg-foreground/10">
          <ArrowLeft className="w-4 h-4 text-foreground" />
        </button>
        <h1 className="text-base font-semibold text-foreground">Sobre Nós</h1>
      </header>

      {/* Logo & Mission */}
      <div className="mx-3 mt-4 glass-card p-6 text-center">
        <img 
          src={zillowLogo} 
          alt="Zillow Rentals" 
          className="w-24 h-24 rounded-2xl mx-auto mb-4 object-cover shadow-lg"
        />
        <h2 className="text-lg font-bold text-foreground mb-2">Zillow Rentals</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Transformando o mercado imobiliário americano em oportunidades de investimento acessíveis para todos.
        </p>
      </div>

      {/* Features Grid */}
      <div className="mx-3 mt-4 grid grid-cols-2 gap-2">
        {features.map((feature, index) => (
          <div key={index} className="glass-card p-4 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center mb-2">
              <feature.icon className="w-5 h-5 text-secondary" />
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-1">{feature.title}</h3>
            <p className="text-xs text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* About Section */}
      <div className="mx-3 mt-4 glass-card p-4 space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Nossa História</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          A Zillow Rentals nasceu da visão de democratizar o acesso ao mercado imobiliário americano. 
          Fundada por especialistas em investimentos e tecnologia, nossa plataforma conecta investidores 
          de todo o mundo a oportunidades exclusivas de aluguel nos Estados Unidos.
        </p>
        
        <h3 className="text-sm font-semibold text-foreground pt-2">Nossa Missão</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Proporcionar retornos consistentes e seguros através de investimentos em propriedades de aluguel, 
          tornando o mercado imobiliário acessível a todos, independentemente do capital inicial.
        </p>

        <h3 className="text-sm font-semibold text-foreground pt-2">Nossos Valores</h3>
        <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
          <li>Transparência em todas as operações</li>
          <li>Segurança como prioridade máxima</li>
          <li>Inovação contínua</li>
          <li>Compromisso com o sucesso do investidor</li>
        </ul>
      </div>

      {/* Stats */}
      <div className="mx-3 mt-4 glass-card p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3 text-center">Em Números</h3>
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center">
            <p className="text-lg font-bold text-secondary">10K+</p>
            <p className="text-[10px] text-muted-foreground">Investidores</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-secondary">$50M+</p>
            <p className="text-[10px] text-muted-foreground">Investidos</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-secondary">500+</p>
            <p className="text-[10px] text-muted-foreground">Propriedades</p>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="mx-3 mt-4 glass-card p-4 text-center">
        <p className="text-xs text-muted-foreground">
          Sede: ZILLOW RENTALS LLC<br />
          Miami, Florida, USA
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          © 2026 Zillow Rentals. Todos os direitos reservados.
        </p>
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

export default AboutUs;
