import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Stethoscope, Mail, Lock, Loader2, User, Briefcase, Phone, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'PACIENTE' | 'PROFISSIONAL'>('PACIENTE');
  
  // Novos estados
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const [crm, setCrm] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword || !nome) {
      toast({ title: 'Erro', description: 'Preencha os campos obrigatórios', variant: 'destructive' });
      return;
    }

    if (role === 'PACIENTE' && !telefone) {
        toast({ title: 'Erro', description: 'Telefone é obrigatório para pacientes', variant: 'destructive' });
        return;
    }

    if (role === 'PROFISSIONAL' && (!especialidade || !crm)) {
        toast({ title: 'Erro', description: 'Especialidade e CRM são obrigatórios', variant: 'destructive' });
        return;
    }

    if (password !== confirmPassword) {
      toast({ title: 'Erro', description: 'As senhas não coincidem', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      await register(email, password, role, {
        nome,
        telefone,
        especialidade,
        crm
      });
      toast({ title: 'Sucesso!', description: 'Conta criada com sucesso' });
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      toast({ title: 'Erro', description: 'Falha ao criar conta. Tente outro email.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md animate-fade-in py-8">
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center shadow-glow mb-4">
            <Stethoscope className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">MedConsulta</h1>
          <p className="text-muted-foreground">Crie sua conta</p>
        </div>

        <Card className="shadow-soft">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Cadastro</CardTitle>
            <CardDescription>Preencha os dados para criar sua conta</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-3">
                <Label>Tipo de conta</Label>
                <RadioGroup value={role} onValueChange={(v) => setRole(v as 'PACIENTE' | 'PROFISSIONAL')} className="grid grid-cols-2 gap-3">
                  <Label
                    htmlFor="paciente"
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all",
                      role === 'PACIENTE' ? "border-primary bg-secondary" : "border-border hover:border-primary/50"
                    )}
                  >
                    <RadioGroupItem value="PACIENTE" id="paciente" className="sr-only" />
                    <User className="h-6 w-6" />
                    <span className="font-medium">Paciente</span>
                  </Label>
                  <Label
                    htmlFor="profissional"
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all",
                      role === 'PROFISSIONAL' ? "border-primary bg-secondary" : "border-border hover:border-primary/50"
                    )}
                  >
                    <RadioGroupItem value="PROFISSIONAL" id="profissional" className="sr-only" />
                    <Briefcase className="h-6 w-6" />
                    <span className="font-medium">Profissional</span>
                  </Label>
                </RadioGroup>
              </div>

              {/* Campos Comuns */}
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="nome" placeholder="Seu nome" value={nome} onChange={(e) => setNome(e.target.value)} className="pl-10" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" />
                </div>
              </div>

              {/* Campos Específicos de Paciente */}
              {role === 'PACIENTE' && (
                <div className="space-y-2 animate-fade-in">
                  <Label htmlFor="telefone">Telefone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="telefone" placeholder="(00) 00000-0000" value={telefone} onChange={(e) => setTelefone(e.target.value)} className="pl-10" />
                  </div>
                </div>
              )}

              {/* Campos Específicos de Profissional */}
              {role === 'PROFISSIONAL' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-2">
                    <Label htmlFor="especialidade">Especialidade</Label>
                    <div className="relative">
                      <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="especialidade" placeholder="Ex: Cardiologia" value={especialidade} onChange={(e) => setEspecialidade(e.target.value)} className="pl-10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="crm">CRM</Label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="crm" placeholder="Ex: 123456/SP" value={crm} onChange={(e) => setCrm(e.target.value)} className="pl-10" />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="confirmPassword" type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="pl-10" />
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Criar Conta'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Já tem uma conta? </span>
              <Link to="/login" className="text-primary font-medium hover:underline">
                Entrar
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}