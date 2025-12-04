import { useEffect, useState } from 'react';
import { User, MapPin, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { SchedulingData, Profissional, Local } from '@/types';
import { profissionalApi, localApi } from '@/services/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface StepConfirmationProps {
  data: SchedulingData;
}

export function StepConfirmation({ data }: StepConfirmationProps) {
  const [profissional, setProfissional] = useState<Profissional | null>(null);
  const [local, setLocal] = useState<Local | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDetails();
  }, [data]);

  const loadDetails = async () => {
    try {
      const [prof, loc] = await Promise.all([
        data.profissionalId ? profissionalApi.getById(data.profissionalId) : Promise.resolve(undefined),
        data.localId ? localApi.getById(data.localId) : Promise.resolve(undefined),
      ]);
      setProfissional(prof || null);
      setLocal(loc || null);
    } catch (error) {
      console.error('Error loading details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const startDate = data.dataHoraInicio ? new Date(data.dataHoraInicio) : null;
  const endDate = data.dataHoraFim ? new Date(data.dataHoraFim) : null;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Confirme sua Consulta</h2>
        <p className="text-muted-foreground">Verifique os dados antes de confirmar</p>
      </div>

      <Card className="shadow-soft">
        <CardContent className="p-0 divide-y divide-border">
          {/* Professional */}
          <div className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
              <User className="h-5 w-5 text-secondary-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Profissional</p>
              <p className="font-medium text-foreground">{profissional?.nome}</p>
              <p className="text-sm text-muted-foreground">{profissional?.especialidade}</p>
            </div>
          </div>

          {/* Location */}
          <div className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
              <MapPin className="h-5 w-5 text-secondary-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Local</p>
              <p className="font-medium text-foreground">{local?.nome}</p>
              <p className="text-sm text-muted-foreground">{local?.endereco}</p>
            </div>
          </div>

          {/* Date */}
          {startDate && (
            <div className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                <Calendar className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Data</p>
                <p className="font-medium text-foreground">
                  {format(startDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </p>
              </div>
            </div>
          )}

          {/* Time */}
          {startDate && endDate && (
            <div className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                <Clock className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Horário</p>
                <p className="font-medium text-foreground">
                  {format(startDate, 'HH:mm')} - {format(endDate, 'HH:mm')}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
