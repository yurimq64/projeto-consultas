import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LocaisService } from './locais.service';
import { CreateLocaiDto } from './dto/create-locai.dto';
import { UpdateLocaiDto } from './dto/update-locai.dto';

@Controller('locais')
export class LocaisController {
  constructor(private readonly locaisService: LocaisService) {}

  @Post()
  create(@Body() createLocaiDto: CreateLocaiDto) {
    return this.locaisService.create(createLocaiDto);
  }

  @Get()
  findAll() {
    return this.locaisService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.locaisService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLocaiDto: UpdateLocaiDto) {
    return this.locaisService.update(+id, updateLocaiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.locaisService.remove(+id);
  }
}
