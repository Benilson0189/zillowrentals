import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Building2, Users, User } from 'lucide-react';

const bottomNavItems = [
  { icon: Home, label: 'Início', path: '/dashboard' },
  { icon: Building2, label: 'Alugar', path: '/rentals' },
  { icon: Users, label: 'Equipe', path: '/team' },
  { icon: User, label: 'Perfil', path: '/profile' },
];

const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="glass-card mx-3 mt-3 p-3 flex items-center gap-2">
        <button onClick={() => navigate('/help')} className="p-1.5 rounded-full hover:bg-foreground/10">
          <ArrowLeft className="w-4 h-4 text-foreground" />
        </button>
        <h1 className="text-base font-semibold text-foreground">Política de Privacidade</h1>
      </header>

      {/* Content */}
      <div className="mx-3 mt-4 glass-card p-4 space-y-4">
        <section>
          <h2 className="text-sm font-semibold text-foreground mb-2">1. Informações que Coletamos</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Coletamos informações que você nos fornece diretamente, incluindo: número de telefone, nome completo, informações bancárias para processamento de pagamentos, e dados de transações.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-foreground mb-2">2. Uso das Informações</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Utilizamos suas informações para: processar transações, verificar sua identidade, prevenir fraudes, enviar notificações sobre sua conta, e melhorar nossos serviços.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-foreground mb-2">3. Compartilhamento de Dados</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Não vendemos suas informações pessoais. Podemos compartilhar dados com: processadores de pagamento para completar transações, autoridades quando exigido por lei, e prestadores de serviços que nos ajudam a operar a plataforma.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-foreground mb-2">4. Segurança dos Dados</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações, incluindo criptografia de dados, autenticação segura e monitoramento contínuo.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-foreground mb-2">5. Retenção de Dados</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Mantemos suas informações pelo tempo necessário para fornecer nossos serviços e cumprir obrigações legais. Você pode solicitar a exclusão de seus dados a qualquer momento.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-foreground mb-2">6. Seus Direitos</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Você tem direito a: acessar seus dados pessoais, corrigir informações incorretas, solicitar a exclusão de seus dados, e retirar seu consentimento a qualquer momento.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-foreground mb-2">7. Cookies</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Utilizamos cookies e tecnologias similares para melhorar sua experiência, analisar o tráfego do site e personalizar conteúdo. Você pode gerenciar suas preferências de cookies nas configurações do navegador.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-foreground mb-2">8. Contato</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Para questões sobre privacidade, entre em contato conosco através do e-mail: privacidade@zillowrentals.app ou pelo WhatsApp de suporte.
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

export default PrivacyPolicy;
