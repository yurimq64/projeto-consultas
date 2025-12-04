import { useEffect, useState } from 'react';
import { ArrowLeft, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppointmentCard } from '@/components/AppointmentCard';
import { BottomNav } from '@/components/BottomNav';
import { useAuth } from '@/contexts/AuthContext';
import { consultaApi, profissionalApi, localApi } from '@/services/api';
import { ConsultaDetalhada } from '@/types';
import { useNavigate } from 'react-router-dom';
import { isAfter, isBefore } from 'date-fns';

export default function History() {
  const { paciente } = useAuth();
  const [consultas, setConsultas] = useState<ConsultaDetalhada[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadConsultas();
  }, [paciente]);

  const loadConsultas = async () => {
    if (!paciente) {
      setIsLoading(false);
      return;
    }

    try {
      const data = await consultaApi.getByPacienteId(paciente.id);
      const [profissionais, locais] = await Promise.all([
        profissionalApi.getAll(),
        localApi.getAll(),
      ]);

      const profMap = new Map(profissionais.map(p => [p.id, p]));
      const localMap = new Map(locais.map(l => [l.id, l]));

      const detailed = data.map(c => ({
        ...c,
        profissional: profMap.get(c.profissionalId),
        local: localMap.get(c.localId),
      }));

      setConsultas(detailed);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const now = new Date();
  const upcoming = consultas
    .filter(c => c.status === 'AGENDADA' && isAfter(new Date(c.dataHoraInicio), now))
    .sort((a, b) => new Date(a.dataHoraInicio).getTime() - new Date(b.dataHoraInicio).getTime());

  const past = consultas
    .filter(c => c.status !== 'AGENDADA' || isBefore(new Date(c.dataHoraInicio), now))
    .sort((a, b) => new Date(b.dataHoraInicio).getTime() - new Date(a.dataHoraInicio).getTime());

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="container flex items-center h-14 px-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground ml-2">Histórico</h1>
        </div>
      </header>

      <main className="container px-4 py-6 animate-slide-up">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="upcoming">Próximas ({upcoming.length})</TabsTrigger>
              <TabsTrigger value="past">Anteriores ({past.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-3">
              {upcoming.length === 0 ? (
                <Card className="shadow-soft">
                  <CardContent className="p-8 text-center">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">Nenhuma consulta agendada</p>
                  </CardContent>
                </Card>
              ) : (
                upcoming.map(consulta => (
                  <AppointmentCard key={consulta.id} consulta={consulta} />
                ))
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-3">
              {past.length === 0 ? (
                <Card className="shadow-soft">
                  <CardContent className="p-8 text-center">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">Nenhuma consulta anterior</p>
                  </CardContent>
                </Card>
              ) : (
                past.map(consulta => (
                  <AppointmentCard key={consulta.id} consulta={consulta} />
                ))
              )}
            </TabsContent>
          </Tabs>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
