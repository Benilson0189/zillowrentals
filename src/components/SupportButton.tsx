import React, { useState } from 'react';
import { Headphones, X, MessageCircle, Users } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const contactOptions = [
  {
    label: 'Grupo Telegram',
    description: 'Junte-se à nossa comunidade',
    icon: MessageCircle,
    href: 'https://t.me/zillowrentals',
    color: 'bg-[#0088cc]',
  },
  {
    label: 'Grupo WhatsApp',
    description: 'Entre no grupo oficial',
    icon: Users,
    href: 'https://chat.whatsapp.com/zillowrentals',
    color: 'bg-success',
  },
  {
    label: 'Falar com Gerente',
    description: 'Atendimento personalizado',
    icon: MessageCircle,
    href: 'https://wa.me/244999999999',
    color: 'bg-success',
  },
];

const SupportButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button
          className="fixed bottom-24 right-3 z-40 w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-secondary/80 shadow-lg flex items-center justify-center hover:scale-105 transition-transform border-2 border-white/20"
          aria-label="Suporte"
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <Headphones className="w-5 h-5 text-white" />
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border border-white animate-pulse" />
          </div>
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-2xl bg-background border-foreground/10">
        <SheetHeader className="text-left pb-4">
          <SheetTitle className="flex items-center gap-2 text-foreground">
            <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
              <Headphones className="w-4 h-4 text-secondary" />
            </div>
            Suporte ao Cliente
          </SheetTitle>
        </SheetHeader>
        
        <div className="space-y-3 pb-6">
          {contactOptions.map((option) => (
            <a
              key={option.label}
              href={option.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl bg-foreground/5 hover:bg-foreground/10 transition-colors"
            >
              <div className={`w-10 h-10 rounded-full ${option.color} flex items-center justify-center`}>
                <option.icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{option.label}</p>
                <p className="text-xs text-muted-foreground">{option.description}</p>
              </div>
            </a>
          ))}
        </div>
        
        <p className="text-center text-xs text-muted-foreground pb-2">
          Atendimento 24h • Resposta rápida
        </p>
      </SheetContent>
    </Sheet>
  );
};

export default SupportButton;
