import { IsNotEmpty, IsString, Length, MinLength } from 'class-validator';

export class CategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
