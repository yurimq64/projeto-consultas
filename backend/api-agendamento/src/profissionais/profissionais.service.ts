import { Injectable } from '@nestjs/common';
import { CreateProfissionalDto } from './dto/create-profissionai.dto';
import { UpdateProfissionaiDto } from './dto/update-profissional.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfissionaisService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateProfissionalDto) {
    return this.prisma.profissional.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.profissional.findMany({
      include: {
        usuario: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
        locais: {
          include: {
            local: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.profissional.findUnique({
      where: { id },
      include: {
        consultas: true,
        locais: {
          include: {
            local: true,
          },
        },
      },
    });
  }

  async update(id: number, data: UpdateProfissionaiDto) {
    return this.prisma.profissional.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.profissional.delete({
      where: { id },
    });
  }

  async associarLocal(profissionalId: number, localId: number) {
    return this.prisma.profissionalLocal.create({
      data: {
        profissionalId,
        localId,
      },
      include: {
        profissional: {
          select: {
            id: true,
            nome: true,
            especialidade: true,
          },
        },
        local: {
          select: {
            id: true,
            nome: true,
            endereco: true,
          },
        },
      },
    });
  }
}
