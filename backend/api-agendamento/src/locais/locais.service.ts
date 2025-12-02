import { Injectable } from '@nestjs/common';
import { CreateLocalDto } from './dto/create-local.dto';
import { UpdateLocalDto } from './dto/update-local.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LocaisService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateLocalDto) {
    return this.prisma.local.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.local.findMany();
  }

  findOne(id: number) {
    return this.prisma.local.findUnique({
      where: { id },
    });
  }

  update(id: number, data: UpdateLocalDto) {
    return this.prisma.local.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.local.delete({
      where: { id },
    });
  }
}
