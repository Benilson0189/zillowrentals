import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Building2, Users, User } from 'lucide-react';

const bottomNavItems = [
  { icon: Home, label: 'Início', path: '/dashboard' },
  { icon: Building2, label: 'Alugar', path: '/rentals' },
  { icon: Users, label: 'Equipe', path: '/team' },
  { icon: User, label: 'Perfil', path: '/profile' },
];

const TermsOfUse: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="glass-card mx-3 mt-3 p-3 flex items-center gap-2">
        <button onClick={() => navigate('/help')} className="p-1.5 rounded-full hover:bg-foreground/10">
          <ArrowLeft className="w-4 h-4 text-foreground" />
        </button>
        <h1 className="text-base font-semibold text-foreground">Termos de Uso</h1>
      </header>

      {/* Content */}
      <div className="mx-3 mt-4 glass-card p-4 space-y-4">
        <section>
          <h2 className="text-sm font-semibold text-foreground mb-2">1. Aceitação dos Termos</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Ao acessar e usar a plataforma Zillow Rentals, você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deverá usar nossos serviços.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-foreground mb-2">2. Descrição do Serviço</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            A Zillow Rentals é uma plataforma de investimento em propriedades de aluguel nos Estados Unidos. Oferecemos oportunidades de investimento com retornos diários baseados nos planos selecionados.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-foreground mb-2">3. Elegibilidade</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Para usar nossos serviços, você deve ter pelo menos 18 anos de idade e capacidade legal para celebrar contratos vinculativos. Você é responsável por garantir que seu uso da plataforma esteja em conformidade com as leis aplicáveis em sua jurisdição.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-foreground mb-2">4. Conta de Usuário</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Você é responsável por manter a confidencialidade de sua conta e senha. Você concorda em notificar-nos imediatamente sobre qualquer uso não autorizado de sua conta.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-foreground mb-2">5. Depósitos e Retiradas</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Todas as transações estão sujeitas à verificação. Os depósitos são processados em até 24 horas após a confirmação. As retiradas são processadas em até 48 horas para contas bancárias verificadas.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-foreground mb-2">6. Riscos de Investimento</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Todo investimento envolve riscos. Os retornos passados não garantem resultados futuros. Você deve investir apenas o que pode perder. A Zillow Rentals não garante lucros.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-foreground mb-2">7. Programa de Referência</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Nosso programa de referência oferece comissões por indicações bem-sucedidas. As taxas de comissão são: Nível A (20%), Nível B (3%) e Nível C (1%). Reservamos o direito de modificar as taxas a qualquer momento.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-foreground mb-2">8. Modificações</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Reservamos o direito de modificar estes termos a qualquer momento. As alterações entram em vigor imediatamente após a publicação na plataforma.
          </p>
        </section>

        <p className="text-xs text-muted-foreground text-center pt-4">
          Última atualização: Janeiro de 2026
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

export default TermsOfUse;
