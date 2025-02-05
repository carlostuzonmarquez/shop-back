import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, ValidateIf, } from "class-validator";

export class EditUserDto {
    @Type(() => Number)
    @IsNotEmpty()
    @IsNumber()
    id: number

    @IsNotEmpty()
    @IsString()
    @IsEmail({}, { message: 'El correo electrónico no tiene un formato válido' })

    username: string

    @IsOptional()
    @ValidateIf((o) => o.password !== undefined && o.password !== "")
    @IsString()
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
        message: 'La contraseña debe contener al menos una letra, un número y tener mínimo 8 caracteres',
    })
    password?: string
}