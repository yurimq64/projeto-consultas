import { Injectable } from '@nestjs/common';
import { CreateLocaiDto } from './dto/create-locai.dto';
import { UpdateLocaiDto } from './dto/update-locai.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LocaisService {
  
  constructor(private prisma: PrismaService) {}

  async create(data: CreateLocaiDto) {
    return this.prisma.local.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.local.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} local`;
  }

  update(id: number, updateLocaiDto: UpdateLocaiDto) {
    return `This action updates a #${id} local`;
  }

  remove(id: number) {
    return `This action removes a #${id} local`;
  }
}
