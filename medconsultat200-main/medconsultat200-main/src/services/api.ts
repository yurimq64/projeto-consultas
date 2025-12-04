import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { AuthResponse, User, Paciente, Profissional, Local, Consulta, SchedulingData } from '@/types';

// Configuração do Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('medconsulta_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper para decodificar o token e pegar os dados do usuário
const getUserFromToken = (token: string): User => {
  const decoded: any = jwtDecode(token);
  return {
    id: decoded.sub,
    email: decoded.email,
    role: decoded.role,
  };
};

// Auth API
export const authApi = {
  login: async (email: string, password: string): Promise<{ user: User; token: AuthResponse }> => {
    const response = await api.post('/auth/login', { email, senha: password });
    const token = response.data;
    const user = getUserFromToken(token.access_token);
    return { user, token };
  },

  // Nova versão do register que aceita dados adicionais
  register: async (
    email: string, 
    password: string, 
    role: 'PACIENTE' | 'PROFISSIONAL',
    extraData: { nome: string; telefone?: string; especialidade?: string; crm?: string }
  ): Promise<{ user: User; token: AuthResponse }> => {
    // 1. Cria o usuário (Login)
    await api.post('/auth/register', { email, senha: password, role });
    
    // 2. Faz o login para pegar o token e o ID do usuário
    const { user, token } = await authApi.login(email, password);
    
    // Configura o token para a próxima requisição
    api.defaults.headers.common['Authorization'] = `Bearer ${token.access_token}`;

    // 3. Cria o perfil específico baseado na Role
    try {
      if (role === 'PACIENTE') {
        await api.post('/pacientes', {
          nome: extraData.nome,
          telefone: extraData.telefone,
          usuarioId: user.id
        });
      } else if (role === 'PROFISSIONAL') {
        await api.post('/profissionais', {
          nome: extraData.nome,
          especialidade: extraData.especialidade || 'Geral',
          crm: extraData.crm || '',
          usuarioId: user.id
        });
      }
    } catch (error) {
      console.error('Erro ao criar perfil:', error);
      // Opcional: rollback ou aviso
    }

    return { user, token };
  },
};

// Paciente API
export const pacienteApi = {
  getByUserId: async (usuarioId: number): Promise<Paciente | undefined> => {
    // Idealmente, o backend deveria ter um endpoint: /pacientes/usuario/${usuarioId}
    // Como paliativo, buscamos todos e filtramos:
    const response = await api.get('/pacientes');
    return response.data.find((p: any) => p.usuarioId === usuarioId);
  },

  getAll: async (): Promise<Paciente[]> => {
    const response = await api.get('/pacientes');
    return response.data;
  },
  
  // Adicionado para suportar a criação de perfil se não existir
  create: async (data: Partial<Paciente>) => {
    const response = await api.post('/pacientes', data);
    return response.data;
  }
};

// Profissional API
export const profissionalApi = {
  getAll: async (): Promise<Profissional[]> => {
    const response = await api.get('/profissionais');
    return response.data;
  },

  getById: async (id: number): Promise<Profissional | undefined> => {
    const response = await api.get(`/profissionais/${id}`);
    return response.data;
  },

  getByUserId: async (usuarioId: number): Promise<Profissional | undefined> => {
    // Paliativo: busca todos e filtra
    const response = await api.get('/profissionais');
    return response.data.find((p: any) => p.usuarioId === usuarioId);
  },

  create: async (data: { nome: string; especialidade: string; crm: string; usuarioId: number }): Promise<Profissional> => {
    // Nota: O backend atual não tem o campo 'crm' no Prisma Schema. 
    // Ele será ignorado pelo backend se não for adicionado lá.
    const response = await api.post('/profissionais', data);
    return response.data;
  },
};

// Local API
export const localApi = {
  getAll: async (): Promise<Local[]> => {
    const response = await api.get('/locais');
    return response.data;
  },

  getById: async (id: number): Promise<Local | undefined> => {
    const response = await api.get(`/locais/${id}`);
    return response.data;
  },

  create: async (data: { nome: string; endereco: string }): Promise<Local> => {
    const response = await api.post('/locais', data);
    return response.data;
  },
};

// Consulta API
export const consultaApi = {
  getByPacienteId: async (pacienteId: number): Promise<Consulta[]> => {
    // Paliativo: O endpoint findAll retorna tudo. Filtragem no front.
    const response = await api.get('/consultas');
    return response.data.filter((c: any) => c.pacienteId === pacienteId);
  },

  getByProfissionalId: async (profissionalId: number): Promise<Consulta[]> => {
    // Paliativo
    const response = await api.get('/consultas');
    return response.data.filter((c: any) => c.profissionalId === profissionalId);
  },

  getByDate: async (profissionalId: number, date: Date): Promise<Consulta[]> => {
    const response = await api.get('/consultas');
    const dateStr = date.toDateString();
    return response.data.filter((c: any) => 
      c.profissionalId === profissionalId && 
      new Date(c.dataHoraInicio).toDateString() === dateStr
    );
  },

  create: async (data: SchedulingData & { pacienteId: number }): Promise<Consulta> => {
    const payload = {
      dataHoraInicio: data.dataHoraInicio,
      dataHoraFim: data.dataHoraFim,
      pacienteId: data.pacienteId,
      profissionalId: data.profissionalId,
      localId: data.localId,
      observacoes: "Agendamento via App"
    };
    const response = await api.post('/consultas', payload);
    return response.data;
  },

  cancel: async (id: number): Promise<Consulta> => {
    // O backend atual não tem endpoint específico 'cancel', usaremos o update/patch
    const response = await api.patch(`/consultas/${id}`, { status: 'CANCELADA' });
    return response.data;
  },

  getAvailableSlots: async (profissionalId: number, date: Date): Promise<string[]> => {
    // Lógica de horários mantida no frontend por enquanto
    const slots = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', 
                   '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'];
    
    // Busca consultas reais do backend
    const response = await api.get('/consultas');
    const consultasDoDia = response.data.filter((c: any) => 
      c.profissionalId === profissionalId && 
      new Date(c.dataHoraInicio).toDateString() === date.toDateString() &&
      c.status !== 'CANCELADA'
    );
    
    const bookedTimes = consultasDoDia.map((c: any) => {
      const d = new Date(c.dataHoraInicio);
      // Ajuste de fuso horário pode ser necessário aqui dependendo de como o servidor retorna
      return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    });
    
    return slots.filter(s => !bookedTimes.includes(s));
  },
};