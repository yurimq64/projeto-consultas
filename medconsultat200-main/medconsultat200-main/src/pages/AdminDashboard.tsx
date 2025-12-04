import { useState } from 'react';
import { AppHeader } from '@/components/AppHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Stethoscope, LayoutDashboard } from 'lucide-react';
import LocationsManager from './admin/LocationsManager';
import ProfessionalsManager from './admin/ProfessionalsManager';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('locations');

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <LayoutDashboard className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Painel Administrativo</h1>
          </div>
          <p className="text-muted-foreground">Gerencie locais e profissionais do sistema</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="locations" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Locais
            </TabsTrigger>
            <TabsTrigger value="professionals" className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4" />
              Profissionais
            </TabsTrigger>
          </TabsList>

          <TabsContent value="locations">
            <LocationsManager />
          </TabsContent>

          <TabsContent value="professionals">
            <ProfessionalsManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
