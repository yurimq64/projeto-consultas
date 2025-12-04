import { useState, useEffect } from 'react';
import { Profissional, User } from '@/types';
import { profissionalApi } from '@/services/api';
import { mockUsers } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Stethoscope } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ProfessionalsManager() {
  const [professionals, setProfessionals] = useState<Profissional[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [nome, setNome] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const [crm, setCrm] = useState('');
  const [usuarioId, setUsuarioId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const profData = await profissionalApi.getAll();
      setProfessionals(profData);
      
      // Filter users that aren't already linked to a professional
      const linkedUserIds = profData.map(p => p.usuarioId);
      const available = mockUsers.filter(
        u => u.role === 'PROFISSIONAL' && !linkedUserIds.includes(u.id)
      );
      setAvailableUsers(available);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !especialidade.trim() || !crm.trim() || !usuarioId) {
      toast({ title: 'Preencha todos os campos', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      await profissionalApi.create({
        nome: nome.trim(),
        especialidade: especialidade.trim(),
        crm: crm.trim(),
        usuarioId: parseInt(usuarioId),
      });
      toast({ title: 'Profissional adicionado com sucesso!' });
      setNome('');
      setEspecialidade('');
      setCrm('');
      setUsuarioId('');
      setIsDialogOpen(false);
      loadData();
    } catch {
      toast({ title: 'Erro ao adicionar profissional', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getUserEmail = (userId: number) => {
    return mockUsers.find(u => u.id === userId)?.email || 'N/A';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Profissionais</h2>
          <p className="text-muted-foreground">Gerencie os médicos e especialistas</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Profissional
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Profissional</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Dr. João Silva"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="especialidade">Especialidade</Label>
                <Input
                  id="especialidade"
                  value={especialidade}
                  onChange={(e) => setEspecialidade(e.target.value)}
                  placeholder="Ex: Cardiologia"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="crm">CRM</Label>
                <Input
                  id="crm"
                  value={crm}
                  onChange={(e) => setCrm(e.target.value)}
                  placeholder="Ex: 123456-SP"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="usuario">Usuário Vinculado</Label>
                <Select value={usuarioId} onValueChange={setUsuarioId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um usuário" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableUsers.length > 0 ? (
                      availableUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.email} (ID: {user.id})
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        Nenhum usuário disponível
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Apenas usuários com role PROFISSIONAL não vinculados
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting || availableUsers.length === 0}>
                  {isSubmitting ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Especialidade</TableHead>
              <TableHead>CRM</TableHead>
              <TableHead>Usuário</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {professionals.map((prof) => (
              <TableRow key={prof.id}>
                <TableCell className="font-medium">{prof.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Stethoscope className="h-4 w-4 text-muted-foreground" />
                    {prof.nome}
                  </div>
                </TableCell>
                <TableCell>{prof.especialidade}</TableCell>
                <TableCell className="text-muted-foreground">{prof.crm || '-'}</TableCell>
                <TableCell className="text-muted-foreground">{getUserEmail(prof.usuarioId)}</TableCell>
              </TableRow>
            ))}
            {professionals.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  Nenhum profissional cadastrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
