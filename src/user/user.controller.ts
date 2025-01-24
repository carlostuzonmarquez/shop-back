import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/CreateUser.dto';
import { EditUserDto } from './dto/EditUser.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post('create')
    createUSer(@Body() createUserDto: CreateUserDto) {
        this.userService.createUser(createUserDto)
        return JSON.stringify({ message: 'ok' })
    }

    @Get('list')
    listUSer() {
        return this.userService.getAll()
    }

    @Delete(':id')
    async deleteUser(@Param('id', ParseIntPipe) id: number) {
        await this.userService.deleteUser(id);
        return this.userService.getAll()
    }
    @Patch('edit')
    updateUser(@Body() editUserDto: EditUserDto) {
        this.userService.updateUser(editUserDto)
        return JSON.stringify({ message: 'ok' })
    }
}
