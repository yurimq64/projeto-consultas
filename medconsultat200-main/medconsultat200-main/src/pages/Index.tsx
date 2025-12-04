import { Link } from 'react-router-dom';
import { Stethoscope, Calendar, Shield, Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: Calendar,
    title: 'Agendamento Fácil',
    description: 'Marque consultas em poucos cliques, 24 horas por dia.',
  },
  {
    icon: Shield,
    title: 'Dados Seguros',
    description: 'Suas informações médicas protegidas com criptografia.',
  },
  {
    icon: Clock,
    title: 'Lembretes',
    description: 'Receba notificações para não esquecer suas consultas.',
  },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-5 pointer-events-none" />
        <div className="container px-4 py-16 md:py-24">
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto animate-slide-up">
            <div className="h-20 w-20 rounded-2xl gradient-primary flex items-center justify-center shadow-glow mb-6">
              <Stethoscope className="h-10 w-10 text-primary-foreground" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              MedConsulta
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-md">
              Agende suas consultas médicas de forma simples, rápida e segura. Sua saúde em boas mãos.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button asChild size="xl" variant="hero">
                <Link to="/cadastro">
                  Começar Agora
                  <ChevronRight className="h-5 w-5 ml-1" />
                </Link>
              </Button>
              <Button asChild size="xl" variant="outline">
                <Link to="/login">Já tenho conta</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container px-4 py-12 md:py-16">
        <h2 className="text-2xl font-bold text-foreground text-center mb-8">
          Por que escolher MedConsulta?
        </h2>
        
        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              className="shadow-soft hover:shadow-md transition-all animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container px-4 py-12">
        <Card className="shadow-soft gradient-card">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold text-foreground mb-3">
              Pronto para cuidar da sua saúde?
            </h2>
            <p className="text-muted-foreground mb-6">
              Crie sua conta gratuitamente e comece a agendar suas consultas.
            </p>
            <Button asChild size="lg">
              <Link to="/cadastro">Criar Conta Grátis</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          © 2024 MedConsulta. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}
