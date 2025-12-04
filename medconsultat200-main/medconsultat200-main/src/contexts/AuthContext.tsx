import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Paciente, Profissional } from '@/types';
import { authApi, pacienteApi, profissionalApi } from '@/services/api';

// Definição completa dos tipos do Contexto
interface AuthContextType {
  user: User | null;
  paciente: Paciente | null;
  profissional: Profissional | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  // Assinatura atualizada do register para aceitar os dados extras
  register: (
    email: string, 
    password: string, 
    role: 'PACIENTE' | 'PROFISSIONAL',
    extraData: { nome: string; telefone?: string; especialidade?: string; crm?: string }
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [profissional, setProfissional] = useState<Profissional | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('medconsulta_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser) as User;
      setUser(parsedUser);
      loadUserProfile(parsedUser);
    } else {
      setIsLoading(false); // Importante: parar o loading se não houver usuário
    }
  }, []);

  const loadUserProfile = async (user: User) => {
    try {
      if (user.role === 'PACIENTE') {
        const pacienteData = await pacienteApi.getByUserId(user.id);
        setPaciente(pacienteData || null);
      } else if (user.role === 'PROFISSIONAL') {
        const profissionalData = await profissionalApi.getByUserId(user.id);
        setProfissional(profissionalData || null);
      }
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { user, token } = await authApi.login(email, password);
      localStorage.setItem('medconsulta_token', token.access_token);
      localStorage.setItem('medconsulta_user', JSON.stringify(user));
      setUser(user);
      await loadUserProfile(user);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const register = async (
    email: string, 
    password: string, 
    role: 'PACIENTE' | 'PROFISSIONAL',
    extraData: { nome: string; telefone?: string; especialidade?: string; crm?: string }
  ) => {
    setIsLoading(true);
    try {
      const { user, token } = await authApi.register(email, password, role, extraData);
      localStorage.setItem('medconsulta_token', token.access_token);
      localStorage.setItem('medconsulta_user', JSON.stringify(user));
      setUser(user);
      await loadUserProfile(user);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('medconsulta_token');
    localStorage.removeItem('medconsulta_user');
    setUser(null);
    setPaciente(null);
    setProfissional(null);
  };

  return (
    <AuthContext.Provider value={{ user, paciente, profissional, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}