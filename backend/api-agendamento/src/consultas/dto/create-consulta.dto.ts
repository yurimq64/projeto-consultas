import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateConsultaDto {
  @IsDateString()
  @IsNotEmpty()
  dataHoraInicio: string;

  @IsDateString()
  @IsNotEmpty()
  dataHoraFim: string;

  @IsString()
  @IsOptional()
  observacoes?: string;

  @IsInt()
  @IsNotEmpty()
  pacienteId: number;

  @IsInt()
  @IsNotEmpty()
  profissionalId: number;

  @IsInt()
  @IsNotEmpty()
  localId: number;
}