// Auth Types
export interface AuthResponse {
  access_token: string;
}

export type UserRole = 'PACIENTE' | 'PROFISSIONAL' | 'ADMIN';

export interface User {
  id: number;
  email: string;
  role: UserRole;
}

// Domain Types
export interface Paciente {
  id: number;
  nome: string;
  telefone: string;
  usuarioId: number;
}

export interface Profissional {
  id: number;
  nome: string;
  especialidade: string;
  crm: string;
  usuarioId: number;
}

export interface Local {
  id: number;
  nome: string;
  endereco: string;
}

export type ConsultaStatus = 'AGENDADA' | 'CANCELADA' | 'REALIZADA';

export interface Consulta {
  id: number;
  dataHoraInicio: string;
  dataHoraFim: string;
  status: ConsultaStatus;
  pacienteId: number;
  profissionalId: number;
  localId: number;
}

// Extended types for UI
export interface ConsultaDetalhada extends Consulta {
  paciente?: Paciente;
  profissional?: Profissional;
  local?: Local;
}

// Scheduling Wizard State
export interface SchedulingData {
  profissionalId?: number;
  localId?: number;
  dataHoraInicio?: string;
  dataHoraFim?: string;
}
