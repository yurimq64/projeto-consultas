import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProfissionaisService } from './profissionais.service';
import { CreateProfissionalDto } from './dto/create-profissionai.dto';
import { UpdateProfissionaiDto } from './dto/update-profissional.dto';
import { AssociarLocalDto } from './dto/associar-local.dto';

@Controller('profissionais')
export class ProfissionaisController {
  constructor(private readonly profissionaisService: ProfissionaisService) {}

  @Post()
  create(@Body() createProfissionaiDto: CreateProfissionalDto) {
    return this.profissionaisService.create(createProfissionaiDto);
  }

  @Get()
  findAll() {
    return this.profissionaisService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profissionaisService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProfissionaiDto: UpdateProfissionaiDto,
  ) {
    return this.profissionaisService.update(+id, updateProfissionaiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profissionaisService.remove(+id);
  }

  @Post(':id/locais')
  associarLocal(
    @Param('id') id: string,
    @Body() associarLocalDto: AssociarLocalDto,
  ) {
    return this.profissionaisService.associarLocal(
      +id,
      associarLocalDto.localId,
    );
  }
}
