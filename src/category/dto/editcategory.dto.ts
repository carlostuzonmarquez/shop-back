import { IsNotEmpty, IsString } from 'class-validator';

export class EditCategoryDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}
