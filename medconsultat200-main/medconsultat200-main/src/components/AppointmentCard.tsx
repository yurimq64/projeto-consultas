import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ConsultaDetalhada, ConsultaStatus } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface AppointmentCardProps {
  consulta: ConsultaDetalhada;
  showPatient?: boolean;
  className?: string;
}

const statusConfig: Record<ConsultaStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  AGENDADA: { label: 'Agendada', variant: 'default' },
  REALIZADA: { label: 'Realizada', variant: 'secondary' },
  CANCELADA: { label: 'Cancelada', variant: 'destructive' },
};

export function AppointmentCard({ consulta, showPatient = false, className }: AppointmentCardProps) {
  const date = new Date(consulta.dataHoraInicio);
  const endDate = new Date(consulta.dataHoraFim);
  const status = statusConfig[consulta.status];

  return (
    <Card className={cn("shadow-soft hover:shadow-md transition-shadow", className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
              <User className="h-6 w-6 text-secondary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                {showPatient ? consulta.paciente?.nome : consulta.profissional?.nome}
              </h3>
              <p className="text-sm text-muted-foreground">
                {showPatient ? 'Paciente' : consulta.profissional?.especialidade}
              </p>
            </div>
          </div>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{format(date, "EEEE, d 'de' MMMM", { locale: ptBR })}</span>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              {format(date, 'HH:mm')} - {format(endDate, 'HH:mm')}
            </span>
          </div>

          {consulta.local && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{consulta.local.nome}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
