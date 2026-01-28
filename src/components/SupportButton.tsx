import React, { useState } from 'react';
import { UserCircle } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import supportAvatar from '@/assets/support-avatar.png';

// WhatsApp Icon (official style)
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

// Telegram Icon (official style)
const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

// Manager Icon
const ManagerIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
);

// Group indicator badge
const GroupBadge = () => (
  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100">
    <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 text-gray-700" fill="currentColor">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
    </svg>
  </div>
);

const contactOptions = [
  {
    label: 'Grupo Telegram',
    description: 'Junte-se à nossa comunidade',
    icon: TelegramIcon,
    href: 'https://t.me/zillowrentals',
    color: 'bg-[#0088cc]',
    isGroup: true,
  },
  {
    label: 'Grupo WhatsApp',
    description: 'Entre no grupo oficial',
    icon: WhatsAppIcon,
    href: 'https://chat.whatsapp.com/zillowrentals',
    color: 'bg-[#25D366]',
    isGroup: true,
  },
  {
    label: 'Falar com Gerente',
    description: 'Atendimento personalizado',
    icon: WhatsAppIcon,
    href: 'https://wa.me/244999999999',
    color: 'bg-[#25D366]',
    isManager: true,
  },
];

const SupportButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button
          className="fixed bottom-24 right-3 z-40 w-14 h-14 rounded-full shadow-lg overflow-hidden hover:scale-105 transition-transform border-2 border-secondary/50"
          aria-label="Suporte"
        >
          <img 
            src={supportAvatar} 
            alt="Suporte"
            className="w-full h-full object-cover"
          />
          <span className="absolute top-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-white animate-pulse" />
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-2xl bg-background border-foreground/10">
        <SheetHeader className="text-left pb-4">
          <SheetTitle className="flex items-center gap-3 text-foreground">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-secondary/30">
              <img src={supportAvatar} alt="Suporte" className="w-full h-full object-cover" />
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
              <div className={`relative w-11 h-11 rounded-full ${option.color} flex items-center justify-center text-white`}>
                <option.icon />
                {option.isGroup && <GroupBadge />}
                {option.isManager && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-secondary rounded-full flex items-center justify-center shadow-sm border border-white">
                    <UserCircle className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
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
