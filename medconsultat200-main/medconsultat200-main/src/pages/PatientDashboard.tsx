import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, History, Search, ChevronRight, Stethoscope } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppHeader } from '@/components/AppHeader';
import { BottomNav } from '@/components/BottomNav';
import { AppointmentCard } from '@/components/AppointmentCard';
import { useAuth } from '@/contexts/AuthContext';
import { consultaApi, profissionalApi, localApi } from '@/services/api';
import { ConsultaDetalhada } from '@/types';
import { format, isAfter } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const quickActions = [
  { to: '/agendar', icon: Calendar, label: 'Agendar Consulta', color: 'bg-primary' },
  { to: '/historico', icon: History, label: 'Meu Histórico', color: 'bg-secondary text-secondary-foreground' },
  { to: '/profissionais', icon: Search, label: 'Buscar Médicos', color: 'bg-accent text-accent-foreground' },
];

export default function PatientDashboard() {
  const { user, paciente } = useAuth();
  const [nextAppointment, setNextAppointment] = useState<ConsultaDetalhada | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNextAppointment();
  }, [paciente]);

  const loadNextAppointment = async () => {
    if (!paciente) {
      setIsLoading(false);
      return;
    }

    try {
      const consultas = await consultaApi.getByPacienteId(paciente.id);
      const now = new Date();
      
      const futureConsultas = consultas
        .filter(c => c.status === 'AGENDADA' && isAfter(new Date(c.dataHoraInicio), now))
        .sort((a, b) => new Date(a.dataHoraInicio).getTime() - new Date(b.dataHoraInicio).getTime());

      if (futureConsultas.length > 0) {
        const consulta = futureConsultas[0];
        const profissional = await profissionalApi.getById(consulta.profissionalId);
        const local = await localApi.getById(consulta.localId);
        setNextAppointment({ ...consulta, profissional, local });
      }
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      <AppHeader />
      
      <main className="container px-4 py-6 space-y-6 animate-slide-up">
        {/* Greeting Section */}
        <section>
          <h2 className="text-2xl font-bold text-foreground">
            {greeting()}, {paciente?.nome?.split(' ')[0] || 'Paciente'}! 👋
          </h2>
          <p className="text-muted-foreground">
            {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
          </p>
        </section>

        {/* Next Appointment */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground">Próxima Consulta</h3>
            <Link to="/historico" className="text-sm text-primary font-medium flex items-center gap-1">
              Ver todas <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          
          {isLoading ? (
            <Card className="shadow-soft">
              <CardContent className="p-6 flex items-center justify-center">
                <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </CardContent>
            </Card>
          ) : nextAppointment ? (
            <AppointmentCard consulta={nextAppointment} />
          ) : (
            <Card className="shadow-soft">
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                  <Stethoscope className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground mb-4">Nenhuma consulta agendada</p>
                <Button asChild>
                  <Link to="/agendar">Agendar Consulta</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Quick Actions */}
        <section>
          <h3 className="font-semibold text-foreground mb-3">Ações Rápidas</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {quickActions.map((action) => (
              <Link key={action.to} to={action.to}>
                <Card className="shadow-soft hover:shadow-md transition-all hover:scale-[1.02] cursor-pointer">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-lg ${action.color} flex items-center justify-center`}>
                      <action.icon className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="font-medium text-foreground">{action.label}</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Health Tips */}
        <section>
          <h3 className="font-semibold text-foreground mb-3">Dicas de Saúde</h3>
          <Card className="shadow-soft gradient-card">
            <CardContent className="p-4">
              <p className="text-sm text-foreground">
                💧 Lembre-se de beber pelo menos 2 litros de água por dia para manter seu corpo hidratado e funcionando bem!
              </p>
            </CardContent>
          </Card>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
