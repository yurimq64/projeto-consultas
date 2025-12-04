import { useEffect, useState } from 'react';
import { Calendar, Clock, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AppHeader } from '@/components/AppHeader';
import { useAuth } from '@/contexts/AuthContext';
import { consultaApi, pacienteApi, localApi } from '@/services/api';
import { ConsultaDetalhada, Paciente, Local } from '@/types';
import { format, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export default function DoctorDashboard() {
  const { profissional } = useAuth();
  const [todayAppointments, setTodayAppointments] = useState<ConsultaDetalhada[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pacientes, setPacientes] = useState<Map<number, Paciente>>(new Map());
  const [locais, setLocais] = useState<Map<number, Local>>(new Map());

  useEffect(() => {
    loadTodayAppointments();
  }, [profissional]);

  const loadTodayAppointments = async () => {
    if (!profissional) {
      setIsLoading(false);
      return;
    }

    try {
      const consultas = await consultaApi.getByProfissionalId(profissional.id);
      const todayConsultas = consultas
        .filter(c => isToday(new Date(c.dataHoraInicio)))
        .sort((a, b) => new Date(a.dataHoraInicio).getTime() - new Date(b.dataHoraInicio).getTime());

      // Load related data
      const [allPacientes, allLocais] = await Promise.all([
        pacienteApi.getAll(),
        localApi.getAll(),
      ]);

      const pacientesMap = new Map(allPacientes.map(p => [p.id, p]));
      const locaisMap = new Map(allLocais.map(l => [l.id, l]));

      setPacientes(pacientesMap);
      setLocais(locaisMap);

      const detailedConsultas = todayConsultas.map(c => ({
        ...c,
        paciente: pacientesMap.get(c.pacienteId),
        local: locaisMap.get(c.localId),
      }));

      setTodayAppointments(detailedConsultas);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AGENDADA': return 'border-l-primary';
      case 'REALIZADA': return 'border-l-success';
      case 'CANCELADA': return 'border-l-destructive';
      default: return 'border-l-muted';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Agenda do Dia" />
      
      <main className="container px-4 py-6 space-y-6 animate-slide-up">
        {/* Stats Header */}
        <section className="grid grid-cols-2 gap-3">
          <Card className="shadow-soft">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-primary">{todayAppointments.filter(a => a.status === 'AGENDADA').length}</p>
              <p className="text-sm text-muted-foreground">Consultas Hoje</p>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-success">{todayAppointments.filter(a => a.status === 'REALIZADA').length}</p>
              <p className="text-sm text-muted-foreground">Realizadas</p>
            </CardContent>
          </Card>
        </section>

        {/* Today's Date */}
        <section className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-5 w-5" />
          <span className="font-medium">
            {format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </span>
        </section>

        {/* Timeline */}
        <section>
          <h3 className="font-semibold text-foreground mb-4">Agenda</h3>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : todayAppointments.length === 0 ? (
            <Card className="shadow-soft">
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Nenhuma consulta agendada para hoje</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {todayAppointments.map((consulta) => {
                const startTime = new Date(consulta.dataHoraInicio);
                const endTime = new Date(consulta.dataHoraFim);
                const isPast = startTime < new Date();

                return (
                  <Card
                    key={consulta.id}
                    className={cn(
                      "shadow-soft border-l-4 transition-all hover:shadow-md",
                      getStatusColor(consulta.status),
                      isPast && consulta.status === 'AGENDADA' && "opacity-60"
                    )}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                            <User className="h-5 w-5 text-secondary-foreground" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground">{consulta.paciente?.nome}</h4>
                            <p className="text-sm text-muted-foreground">{consulta.paciente?.telefone}</p>
                          </div>
                        </div>
                        <Badge variant={consulta.status === 'AGENDADA' ? 'default' : consulta.status === 'REALIZADA' ? 'secondary' : 'destructive'}>
                          {consulta.status}
                        </Badge>
                      </div>

                      <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{format(startTime, 'HH:mm')} - {format(endTime, 'HH:mm')}</span>
                        </div>
                        {consulta.local && (
                          <span>• {consulta.local.nome}</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
