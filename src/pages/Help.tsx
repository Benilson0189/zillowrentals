import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  Building2, 
  Users, 
  User,
  ArrowLeft,
  HelpCircle,
  MessageCircle,
  Mail,
  FileText,
  ChevronRight
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const bottomNavItems = [
  { icon: Home, label: 'Início', path: '/dashboard' },
  { icon: Building2, label: 'Alugar', path: '/rentals' },
  { icon: Users, label: 'Equipe', path: '/team' },
  { icon: User, label: 'Perfil', path: '/profile' },
];

const faqs = [
  {
    question: 'Como funciona o sistema de aluguel?',
    answer: 'Você investe em propriedades de aluguel nos EUA e recebe retornos diários baseados no plano escolhido. Os retornos variam de acordo com o valor investido e a duração do plano.'
  },
  {
    question: 'Como faço uma recarga?',
    answer: 'Vá em Perfil > Recarga, escolha o valor e o método de pagamento. Faça a transferência para a conta indicada e envie o comprovante. A aprovação leva até 24 horas.'
  },
  {
    question: 'Como faço uma retirada?',
    answer: 'Vá em Perfil > Retirada, insira o valor desejado (mínimo $10). O valor será enviado para sua conta bancária vinculada em até 48 horas.'
  },
  {
    question: 'Como funciona o sistema de convites?',
    answer: 'Compartilhe seu código de convite com amigos. Quando eles investem, você ganha comissões: 20% do nível A (convites diretos), 3% do nível B e 1% do nível C.'
  },
  {
    question: 'O que é o bônus de check-in?',
    answer: 'Faça check-in diário no app e ganhe de 10 a 50 Kz de bônus! O valor é aleatório e só pode ser recebido uma vez por dia.'
  },
  {
    question: 'Como vincular minha conta bancária?',
    answer: 'Vá em Perfil > Informações Pessoais e adicione sua conta bancária com Nome do Banco, Titular e IBAN. Esta conta será usada para receber suas retiradas.'
  },
];

const Help: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="glass-card mx-3 mt-3 p-3 flex items-center gap-2">
        <button onClick={() => navigate('/profile')} className="p-1.5 rounded-full hover:bg-foreground/10">
          <ArrowLeft className="w-4 h-4 text-foreground" />
        </button>
        <h1 className="text-base font-semibold text-foreground">Ajuda e Suporte</h1>
      </header>

      {/* Contact Options */}
      <div className="mx-3 mt-4 grid grid-cols-2 gap-2">
        <a
          href="https://wa.me/244999999999"
          target="_blank"
          rel="noopener noreferrer"
          className="glass-card p-4 flex flex-col items-center gap-2 hover:bg-foreground/5 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-success" />
          </div>
          <span className="text-sm font-medium text-foreground">WhatsApp</span>
          <span className="text-xs text-muted-foreground">Suporte rápido</span>
        </a>
        
        <a
          href="mailto:suporte@zillowrentals.app"
          className="glass-card p-4 flex flex-col items-center gap-2 hover:bg-foreground/5 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
            <Mail className="w-5 h-5 text-secondary" />
          </div>
          <span className="text-sm font-medium text-foreground">E-mail</span>
          <span className="text-xs text-muted-foreground">Suporte formal</span>
        </a>
      </div>

      {/* FAQ Section */}
      <div className="mx-3 mt-4">
        <h2 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
          <HelpCircle className="w-4 h-4" />
          Perguntas Frequentes
        </h2>
        
        <div className="glass-card overflow-hidden">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-foreground/10">
                <AccordionTrigger className="px-4 py-3 text-sm text-foreground hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-3 text-sm text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      {/* Terms & Privacy */}
      <div className="mx-3 mt-4 space-y-2">
        <button 
          onClick={() => navigate('/terms')}
          className="glass-card w-full p-3 flex items-center justify-between hover:bg-foreground/5 transition-colors"
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-foreground">Termos de Uso</span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
        
        <button 
          onClick={() => navigate('/privacy')}
          className="glass-card w-full p-3 flex items-center justify-between hover:bg-foreground/5 transition-colors"
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-foreground">Política de Privacidade</span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Version Info */}
      <div className="mx-3 mt-6 text-center">
        <p className="text-xs text-muted-foreground">Zillow Rentals v1.0.0</p>
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

export default Help;
