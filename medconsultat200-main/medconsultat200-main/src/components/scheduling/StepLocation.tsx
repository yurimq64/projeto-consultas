import { useEffect, useState } from 'react';
import { MapPin, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { localApi } from '@/services/api';
import { Local } from '@/types';
import { cn } from '@/lib/utils';

interface StepLocationProps {
  selectedId?: number;
  onSelect: (id: number) => void;
}

export function StepLocation({ selectedId, onSelect }: StepLocationProps) {
  const [locais, setLocais] = useState<Local[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLocais();
  }, []);

  const loadLocais = async () => {
    try {
      const data = await localApi.getAll();
      setLocais(data);
    } catch (error) {
      console.error('Error loading locations:', error);
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
      <h2 className="text-lg font-semibold text-foreground mb-4">Selecione o Local</h2>
      
      {locais.map((local) => (
        <Card
          key={local.id}
          className={cn(
            "cursor-pointer transition-all shadow-soft hover:shadow-md",
            selectedId === local.id && "ring-2 ring-primary"
          )}
          onClick={() => onSelect(local.id)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{local.nome}</h3>
                  <p className="text-sm text-muted-foreground">{local.endereco}</p>
                </div>
              </div>
              {selectedId === local.id && (
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
