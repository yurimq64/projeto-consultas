import { User, Mail, Phone, LogOut, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BottomNav } from '@/components/BottomNav';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, paciente, profissional, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const profile = paciente || profissional;
  const roleLabel = user?.role === 'PACIENTE' ? 'Paciente' : user?.role === 'PROFISSIONAL' ? 'Profissional de Saúde' : 'Usuário';

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      {/* Header */}
      <header className="gradient-primary">
        <div className="container px-4 py-8 text-center">
          <div className="h-20 w-20 rounded-full bg-primary-foreground/20 flex items-center justify-center mx-auto mb-4">
            <User className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-semibold text-primary-foreground">
            {profile?.nome || 'Usuário'}
          </h1>
          <p className="text-primary-foreground/80">{roleLabel}</p>
        </div>
      </header>

      <main className="container px-4 py-6 space-y-4 animate-slide-up -mt-4">
        {/* Info Card */}
        <Card className="shadow-soft">
          <CardContent className="p-0 divide-y divide-border">
            <div className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                <Mail className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">E-mail</p>
                <p className="font-medium text-foreground">{user?.email}</p>
              </div>
            </div>

            {paciente?.telefone && (
              <div className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                  <Phone className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p className="font-medium text-foreground">{paciente.telefone}</p>
                </div>
              </div>
            )}

            {profissional?.especialidade && (
              <div className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                  <User className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Especialidade</p>
                  <p className="font-medium text-foreground">{profissional.especialidade}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Menu Items */}
        <Card className="shadow-soft">
          <CardContent className="p-0">
            <button
              onClick={handleLogout}
              className="w-full p-4 flex items-center gap-3 text-destructive hover:bg-destructive/5 transition-colors"
            >
              <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <LogOut className="h-5 w-5" />
              </div>
              <span className="flex-1 text-left font-medium">Sair da Conta</span>
              <ChevronRight className="h-5 w-5" />
            </button>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
}
