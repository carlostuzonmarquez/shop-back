import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class EditProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  stock: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  @Transform(({ value }) => value.map(Number))
  categories: number[];
}
