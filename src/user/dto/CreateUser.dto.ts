import { IsEmail, IsNotEmpty, IsString, Matches, } from "class-validator";

export class CreateUserDto {
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