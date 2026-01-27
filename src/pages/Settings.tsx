import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  Building2, 
  Users, 
  User,
  ArrowLeft,
  Bell,
  Moon,
  Sun,
  Globe,
  Lock,
  ChevronRight
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const bottomNavItems = [
  { icon: Home, label: 'Início', path: '/dashboard' },
  { icon: Building2, label: 'Alugar', path: '/rentals' },
  { icon: Users, label: 'Equipe', path: '/team' },
  { icon: User, label: 'Perfil', path: '/profile' },
];

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const handleNotificationToggle = (checked: boolean) => {
    setNotifications(checked);
    toast.success(checked ? 'Notificações ativadas' : 'Notificações desativadas');
  };

  const handleDarkModeToggle = (checked: boolean) => {
    setDarkMode(checked);
    toast.info('Modo claro em breve disponível');
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="glass-card mx-3 mt-3 p-3 flex items-center gap-2">
        <button onClick={() => navigate('/profile')} className="p-1.5 rounded-full hover:bg-foreground/10">
          <ArrowLeft className="w-4 h-4 text-foreground" />
        </button>
        <h1 className="text-base font-semibold text-foreground">Configurações</h1>
      </header>

      {/* Preferences Section */}
      <div className="mx-3 mt-4">
        <h2 className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Preferências</h2>
        
        <div className="glass-card overflow-hidden divide-y divide-foreground/10">
          {/* Notifications */}
          <div className="p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/10">
                <Bell className="w-4 h-4 text-secondary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Notificações</p>
                <p className="text-xs text-muted-foreground">Receber alertas de transações</p>
              </div>
            </div>
            <Switch
              checked={notifications}
              onCheckedChange={handleNotificationToggle}
            />
          </div>

          {/* Dark Mode */}
          <div className="p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-foreground/10">
                {darkMode ? (
                  <Moon className="w-4 h-4 text-foreground" />
                ) : (
                  <Sun className="w-4 h-4 text-warning" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Modo Escuro</p>
                <p className="text-xs text-muted-foreground">Tema da aplicação</p>
              </div>
            </div>
            <Switch
              checked={darkMode}
              onCheckedChange={handleDarkModeToggle}
            />
          </div>

          {/* Language */}
          <button className="w-full p-3 flex items-center justify-between hover:bg-foreground/5 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <Globe className="w-4 h-4 text-success" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">Idioma</p>
                <p className="text-xs text-muted-foreground">Português</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Security Section */}
      <div className="mx-3 mt-4">
        <h2 className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Segurança</h2>
        
        <div className="glass-card overflow-hidden divide-y divide-foreground/10">
          {/* Change Password */}
          <button 
            onClick={() => toast.info('Em breve')}
            className="w-full p-3 flex items-center justify-between hover:bg-foreground/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <Lock className="w-4 h-4 text-warning" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">Alterar Senha</p>
                <p className="text-xs text-muted-foreground">Atualizar credenciais</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* About Section */}
      <div className="mx-3 mt-4">
        <h2 className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Sobre</h2>
        
        <div className="glass-card p-4">
          <div className="text-center">
            <h3 className="text-lg font-bold text-foreground">Zillow Rentals</h3>
            <p className="text-xs text-muted-foreground mt-1">Versão 1.0.0</p>
            <p className="text-xs text-muted-foreground mt-2">
              Plataforma de investimento em aluguéis imobiliários nos EUA.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              © 2025 Zillow Rentals LLC. Todos os direitos reservados.
            </p>
          </div>
        </div>
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

export default Settings;
