import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/CreateUser.dto';
import { EditUserDto } from './dto/EditUser.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
//@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  createUSer(@Body() createUserDto: CreateUserDto) {
    this.userService.createUser(createUserDto);
    return { message: 'ok' };
  }

  @Get('list')
  listUSer() {
    return this.userService.getAll();
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    await this.userService.deleteUser(id);
    return this.userService.getAll();
  }
  @Patch('edit')
  updateUser(@Body() editUserDto: EditUserDto) {
    this.userService.updateUser(editUserDto);
    return { message: 'ok' };
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.userService.findById(id);
    } catch (error) {
      return { message: error.message };
    }
  }
}
