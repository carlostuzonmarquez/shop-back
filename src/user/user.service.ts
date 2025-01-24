import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/CreateUser.dto';
import { Injectable } from '@nestjs/common';
import { EditUserDto } from './dto/EditUser.dto';
import * as argon2 from 'argon2'
@Injectable()
export class UserService {
    constructor(private prismaService: PrismaService) { }

    async createUser(createUserDto: CreateUserDto) {
        const hashedPassword = await argon2.hash(createUserDto.password)
        await this.prismaService.user.create({
            data: {
                username: createUserDto.username,
                password: hashedPassword
            }
        })

    }
    async getAll() {
        return await this.prismaService.user.findMany()
    }

    async deleteUser(id: number) {
        await this.prismaService.user.delete({ where: { id } })
    }
    async updateUser(editUserDto: EditUserDto) {
        const password = await argon2.hash(editUserDto.password)

        return await this.prismaService.user.update({
            where: { id: editUserDto.id },
            data: {
                username: editUserDto.username,
                password: password
            }
        });
    }


}
