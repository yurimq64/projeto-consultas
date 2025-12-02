import { IsNotEmpty, IsString } from "class-validator";

export class CreateLocalDto {
  @IsString()
  @IsNotEmpty()
  nome: string;
  
  @IsString()
  @IsNotEmpty()
  endereco: string;
}
