import { User, Paciente, Profissional, Local, Consulta } from '@/types';

export const mockUsers: User[] = [
  { id: 1, email: 'paciente@test.com', role: 'PACIENTE' },
  { id: 2, email: 'medico@test.com', role: 'PROFISSIONAL' },
  { id: 3, email: 'admin@test.com', role: 'ADMIN' },
  { id: 4, email: 'paciente2@test.com', role: 'PACIENTE' },
  { id: 5, email: 'paciente3@test.com', role: 'PACIENTE' },
  { id: 6, email: 'dra.fernanda@test.com', role: 'PROFISSIONAL' },
  { id: 7, email: 'dr.roberto@test.com', role: 'PROFISSIONAL' },
  { id: 8, email: 'dra.patricia@test.com', role: 'PROFISSIONAL' },
  { id: 9, email: 'dr.novo@test.com', role: 'PROFISSIONAL' },
  { id: 10, email: 'dra.nova@test.com', role: 'PROFISSIONAL' },
];

export const mockPacientes: Paciente[] = [
  { id: 1, nome: 'Maria Silva', telefone: '(11) 98765-4321', usuarioId: 1 },
  { id: 2, nome: 'João Santos', telefone: '(11) 91234-5678', usuarioId: 4 },
  { id: 3, nome: 'Ana Costa', telefone: '(11) 99876-5432', usuarioId: 5 },
];

export const mockProfissionais: Profissional[] = [
  { id: 1, nome: 'Dr. Carlos Mendes', especialidade: 'Cardiologia', usuarioId: 2 },
  { id: 2, nome: 'Dra. Fernanda Lima', especialidade: 'Dermatologia', usuarioId: 6 },
  { id: 3, nome: 'Dr. Roberto Alves', especialidade: 'Ortopedia', usuarioId: 7 },
  { id: 4, nome: 'Dra. Patricia Souza', especialidade: 'Pediatria', usuarioId: 8 },
];

export const mockLocais: Local[] = [
  { id: 1, nome: 'Clínica Central', endereco: 'Av. Paulista, 1000 - São Paulo' },
  { id: 2, nome: 'Hospital São Lucas', endereco: 'Rua Augusta, 500 - São Paulo' },
  { id: 3, nome: 'Centro Médico Norte', endereco: 'Av. Santana, 200 - São Paulo' },
];

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

export const mockConsultas: Consulta[] = [
  {
    id: 1,
    dataHoraInicio: new Date(today.setHours(9, 0, 0, 0)).toISOString(),
    dataHoraFim: new Date(today.setHours(9, 30, 0, 0)).toISOString(),
    status: 'AGENDADA',
    pacienteId: 1,
    profissionalId: 1,
    localId: 1,
  },
  {
    id: 2,
    dataHoraInicio: new Date(today.setHours(10, 0, 0, 0)).toISOString(),
    dataHoraFim: new Date(today.setHours(10, 30, 0, 0)).toISOString(),
    status: 'AGENDADA',
    pacienteId: 2,
    profissionalId: 1,
    localId: 1,
  },
  {
    id: 3,
    dataHoraInicio: new Date(tomorrow.setHours(14, 0, 0, 0)).toISOString(),
    dataHoraFim: new Date(tomorrow.setHours(14, 30, 0, 0)).toISOString(),
    status: 'AGENDADA',
    pacienteId: 1,
    profissionalId: 2,
    localId: 2,
  },
  {
    id: 4,
    dataHoraInicio: new Date(today.setHours(11, 0, 0, 0)).toISOString(),
    dataHoraFim: new Date(today.setHours(11, 30, 0, 0)).toISOString(),
    status: 'REALIZADA',
    pacienteId: 3,
    profissionalId: 1,
    localId: 1,
  },
];
