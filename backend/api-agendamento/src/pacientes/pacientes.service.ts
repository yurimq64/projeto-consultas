import { Injectable } from '@nestjs/common';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PacientesService {
  
  constructor(private prisma: PrismaService) {}

  async create(data: CreatePacienteDto) {
    return this.prisma.paciente.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.paciente.findMany({
      include: { 
        usuario: {
          select: {
            id: true,
            email: true,
            role: true,
          }
        } 
      }, 
    });
  }

  async findOne(id: number) {
    return this.prisma.paciente.findUnique({
      where: { id },
      include: { consultas: true },
    });
  }

  async update(id: number, data: UpdatePacienteDto) {
    return this.prisma.paciente.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.paciente.delete({
      where: { id },
    });
  }
}