import {
  Controller,
  Get,
  Param,
  Delete,
  Post,
  Body,
  Logger,
  Patch,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserDto } from '../dto/user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getUsers() {
    return await this.userService.getUsers();
  }

  @Get('/:id')
  async getUserById(@Param('id') id: number): Promise<UserDto> {
    return await this.userService.getUserById(id);
  }

  @Get('name/:name')
  async getUserByName(@Param('name') name: string): Promise<UserDto> {
    return await this.userService.getUserByName(name);
  }

  @Patch('/:id')
  updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDto> {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: number): Promise<any> {
    return this.userService.deleteUser(id);
  }
}
