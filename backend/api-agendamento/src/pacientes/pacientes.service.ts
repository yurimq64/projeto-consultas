import { Injectable } from '@nestjs/common';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { PrismaService } from '../prisma/prisma.service'; // 👈 Importamos nossa ponte com o banco

@Injectable()
export class PacientesService {
  
  // 1. Injeção de Dependência
  // Pedimos ao NestJS para nos dar o PrismaService pronto para uso
  constructor(private prisma: PrismaService) {}

  // 2. Criar (Create)
  async create(data: CreatePacienteDto) {
    return this.prisma.paciente.create({
      data, // O DTO já tem os campos certos (nome, telefone, usuarioId)
    });
  }

  // 3. Listar Todos (Read All)
  async findAll() {
    return this.prisma.paciente.findMany({
      include: { usuario: true }, // Traz também os dados de Login (email) junto
    });
  }

  // 4. Buscar por ID (Read One)
  async findOne(id: number) {
    return this.prisma.paciente.findUnique({
      where: { id },
      include: { consultas: true }, // Traz o histórico de consultas desse paciente
    });
  }

  // 5. Atualizar (Update)
  async update(id: number, data: UpdatePacienteDto) {
    return this.prisma.paciente.update({
      where: { id },
      data,
    });
  }

  // 6. Deletar (Delete)
  async remove(id: number) {
    return this.prisma.paciente.delete({
      where: { id },
    });
  }
}