import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNumber, IsString, Matches, } from "class-validator";

export class EditUserDto {
    @Type(() => Number)
    @IsNotEmpty()
    @IsNumber()
    id: number

    @IsNotEmpty()
    @IsString()
    @IsEmail({}, { message: 'El correo electrónico no tiene un formato válido' })
    username: string

    @IsNotEmpty()
    @IsString()
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
        message: 'La contraseña debe contener al menos una letra, un número y tener mínimo 8 caracteres',
    })
    password: string
}