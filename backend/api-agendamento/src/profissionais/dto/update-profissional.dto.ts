import { PartialType } from '@nestjs/mapped-types';
import { CreateProfissionalDto } from './create-profissionai.dto';

export class UpdateProfissionaiDto extends PartialType(CreateProfissionalDto) {}
