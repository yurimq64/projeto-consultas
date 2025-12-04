import { useEffect, useState } from 'react';
import { User, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { profissionalApi } from '@/services/api';
import { Profissional } from '@/types';
import { cn } from '@/lib/utils';

interface StepProfessionalProps {
  selectedId?: number;
  onSelect: (id: number) => void;
}

export function StepProfessional({ selectedId, onSelect }: StepProfessionalProps) {
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfissionais();
  }, []);

  const loadProfissionais = async () => {
    try {
      const data = await profissionalApi.getAll();
      setProfissionais(data);
    } catch (error) {
      console.error('Error loading professionals:', error);
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

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground mb-4">Selecione o Profissional</h2>
      
      {profissionais.map((prof) => (
        <Card
          key={prof.id}
          className={cn(
            "cursor-pointer transition-all shadow-soft hover:shadow-md",
            selectedId === prof.id && "ring-2 ring-primary"
          )}
          onClick={() => onSelect(prof.id)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                  <User className="h-6 w-6 text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{prof.nome}</h3>
                  <p className="text-sm text-muted-foreground">{prof.especialidade}</p>
                </div>
              </div>
              {selectedId === prof.id && (
                <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                  <Check className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
