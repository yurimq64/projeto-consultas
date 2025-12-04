import { useEffect, useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { consultaApi } from '@/services/api';
import { cn } from '@/lib/utils';
import { addMinutes, format, setHours, setMinutes, isBefore, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface StepDateTimeProps {
  profissionalId: number;
  selectedDateTime?: string;
  onSelect: (start: string, end: string) => void;
}

export function StepDateTime({ profissionalId, selectedDateTime, onSelect }: StepDateTimeProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    selectedDateTime ? new Date(selectedDateTime) : undefined
  );
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    selectedDateTime ? format(new Date(selectedDateTime), 'HH:mm') : undefined
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedDate) {
      loadAvailableSlots(selectedDate);
    }
  }, [selectedDate, profissionalId]);

  const loadAvailableSlots = async (date: Date) => {
    setIsLoading(true);
    try {
      const slots = await consultaApi.getAvailableSlots(profissionalId, date);
      setAvailableSlots(slots);
      setSelectedTime(undefined);
    } catch (error) {
      console.error('Error loading slots:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    
    if (selectedDate) {
      const [hours, minutes] = time.split(':').map(Number);
      const startDate = setMinutes(setHours(selectedDate, hours), minutes);
      const endDate = addMinutes(startDate, 30);
      
      onSelect(startDate.toISOString(), endDate.toISOString());
    }
  };

  const isDateDisabled = (date: Date) => {
    return isBefore(date, startOfDay(new Date()));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Selecione a Data</h2>
        <Card className="shadow-soft">
          <CardContent className="p-3">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={isDateDisabled}
              locale={ptBR}
              className="pointer-events-auto mx-auto"
            />
          </CardContent>
        </Card>
      </div>

      {selectedDate && (
        <div className="animate-fade-in">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Horários Disponíveis - {format(selectedDate, "d 'de' MMMM", { locale: ptBR })}
          </h2>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : availableSlots.length === 0 ? (
            <Card className="shadow-soft">
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">Nenhum horário disponível nesta data</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {availableSlots.map((slot) => (
                <Button
                  key={slot}
                  variant={selectedTime === slot ? "default" : "outline"}
                  className={cn(
                    "h-12",
                    selectedTime === slot && "shadow-glow"
                  )}
                  onClick={() => handleTimeSelect(slot)}
                >
                  {slot}
                </Button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
