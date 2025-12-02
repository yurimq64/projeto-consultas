import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateConsultaDto } from './dto/create-consulta.dto';
import { UpdateConsultaDto } from './dto/update-consulta.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ConsultasService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateConsultaDto) {
    const paciente = await this.prisma.paciente.findUnique({ where: { id: data.pacienteId } });
    const profissional = await this.prisma.profissional.findUnique({ where: { id: data.profissionalId } });
    const local = await this.prisma.local.findUnique({ where: { id: data.localId } });

    if (!paciente) throw new NotFoundException('Paciente não encontrado');
    if (!profissional) throw new NotFoundException('Profissional não encontrado');
    if (!local) throw new NotFoundException('Local não encontrado');

    const novaDataInicio = new Date(data.dataHoraInicio);
    const novaDataFim = new Date(data.dataHoraFim);

    const conflito = await this.prisma.consulta.findFirst({
      where: {
        profissionalId: data.profissionalId,
        status: { not: 'CANCELADA' },
        AND: [
          { dataHoraInicio: { lt: novaDataFim } },
          { dataHoraFim: { gt: novaDataInicio } },
        ],
      },
    });

    if (conflito) {
      throw new BadRequestException('O profissional já possui agendamento neste horário.');
    }

    return this.prisma.consulta.create({
      data: {
        dataHoraInicio: novaDataInicio,
        dataHoraFim: novaDataFim,
        observacoes: data.observacoes,
        pacienteId: data.pacienteId,
        profissionalId: data.profissionalId,
        localId: data.localId,
        status: 'AGENDADA',
      },
    });
  }

  async findAll() {
    return this.prisma.consulta.findMany({
      include: {
        paciente: { select: { nome: true } },
        profissional: { select: { nome: true, especialidade: true } },
        local: { select: { nome: true } },
      },
    });
  }

  findOne(id: number) { return `This action returns a #${id} consulta`; }
  update(id: number, updateConsultaDto: UpdateConsultaDto) { return `This action updates a #${id} consulta`; }
  remove(id: number) { return `This action removes a #${id} consulta`; }
}