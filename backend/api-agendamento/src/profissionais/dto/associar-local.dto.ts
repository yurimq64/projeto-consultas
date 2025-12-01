import { IsInt, IsNotEmpty } from "class-validator";

export class AssociarLocalDto {
  @IsInt()
  @IsNotEmpty()
  localId: number;
}


