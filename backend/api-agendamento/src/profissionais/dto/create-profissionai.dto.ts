import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateProfissionalDto {
  @IsInt()
  @IsNotEmpty()
  usuarioId: number;
  
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsNotEmpty()
  especialidade: string;
}
