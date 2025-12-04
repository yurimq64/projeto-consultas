import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SchedulingData } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { consultaApi } from '@/services/api';
import { toast } from '@/hooks/use-toast';
import { StepProfessional } from '@/components/scheduling/StepProfessional';
import { StepLocation } from '@/components/scheduling/StepLocation';
import { StepDateTime } from '@/components/scheduling/StepDateTime';
import { StepConfirmation } from '@/components/scheduling/StepConfirmation';
import { cn } from '@/lib/utils';

const steps = [
  { id: 1, label: 'Profissional' },
  { id: 2, label: 'Local' },
  { id: 3, label: 'Data e Hora' },
  { id: 4, label: 'Confirmação' },
];

export default function Scheduling() {
  const [currentStep, setCurrentStep] = useState(1);
  const [schedulingData, setSchedulingData] = useState<SchedulingData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { paciente } = useAuth();
  const navigate = useNavigate();

  const updateData = (data: Partial<SchedulingData>) => {
    setSchedulingData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
    else navigate(-1);
  };

  const handleSubmit = async () => {
    if (!paciente) {
      toast({ title: 'Erro', description: 'Usuário não autenticado', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      await consultaApi.create({
        ...schedulingData,
        pacienteId: paciente.id,
      });
      toast({ title: 'Sucesso!', description: 'Consulta agendada com sucesso' });
      navigate('/dashboard');
    } catch (error) {
      toast({ title: 'Erro', description: 'Falha ao agendar consulta', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return !!schedulingData.profissionalId;
      case 2: return !!schedulingData.localId;
      case 3: return !!schedulingData.dataHoraInicio;
      default: return true;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="container flex items-center h-14 px-4">
          <Button variant="ghost" size="icon" onClick={prevStep}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground ml-2">Agendar Consulta</h1>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="container px-4 py-4">
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                    currentStep > step.id
                      ? "bg-primary text-primary-foreground"
                      : currentStep === step.id
                      ? "bg-primary text-primary-foreground shadow-glow"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {currentStep > step.id ? <Check className="h-4 w-4" /> : step.id}
                </div>
                <span className="text-xs mt-1 text-muted-foreground hidden sm:block">{step.label}</span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 w-8 sm:w-16 mx-2",
                    currentStep > step.id ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <main className="container px-4 pb-24 animate-fade-in">
        {currentStep === 1 && (
          <StepProfessional
            selectedId={schedulingData.profissionalId}
            onSelect={(id) => updateData({ profissionalId: id })}
          />
        )}
        {currentStep === 2 && (
          <StepLocation
            selectedId={schedulingData.localId}
            onSelect={(id) => updateData({ localId: id })}
          />
        )}
        {currentStep === 3 && (
          <StepDateTime
            profissionalId={schedulingData.profissionalId!}
            selectedDateTime={schedulingData.dataHoraInicio}
            onSelect={(start, end) => updateData({ dataHoraInicio: start, dataHoraFim: end })}
          />
        )}
        {currentStep === 4 && (
          <StepConfirmation data={schedulingData} />
        )}
      </main>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-card border-t border-border">
        <div className="container">
          {currentStep < 4 ? (
            <Button
              className="w-full"
              size="lg"
              onClick={nextStep}
              disabled={!canProceed()}
            >
              Continuar
            </Button>
          ) : (
            <Button
              className="w-full"
              size="lg"
              variant="hero"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Agendando...' : 'Confirmar Agendamento'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
