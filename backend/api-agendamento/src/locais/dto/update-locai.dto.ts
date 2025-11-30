import { PartialType } from '@nestjs/mapped-types';
import { CreateLocaiDto } from './create-locai.dto';

export class UpdateLocaiDto extends PartialType(CreateLocaiDto) {}
