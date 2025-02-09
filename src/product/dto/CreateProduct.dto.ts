import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  stock: number;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  @Transform(({ value }) => value.map(Number))
  categories: number[];

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  photos: string[];
}
