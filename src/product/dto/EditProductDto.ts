import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class EditProductDto {
    @Type(() => Number)
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string

    @Type(() => Number)
    @IsNotEmpty()
    @IsNumber()
    stock: number

    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    price: number
}