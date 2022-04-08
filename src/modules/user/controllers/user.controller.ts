import {
  Controller,
  Get,
  Param,
  Delete,
  Post,
  Body,
  Logger,
  Patch,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { diskStorage } from 'multer';

import { UserDto } from '../dto/user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/common/decorators';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserService } from '../services/user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { editFileName, imageFileFilter } from 'src/utils/file.upload';


@Controller('user')
export class UserController {
  constructor(private _userService: UserService) {}

  @Get()
  async getUsers() {
    return await this._userService.getUsers();
  }

  @Get('/:id')
  async getUserById(@Param('id') id: number): Promise<UserDto> {
    return await this._userService.getUserById(id);
  }

  @Get('name/:name')
  async getUserByName(@Param('name') name: string): Promise<UserDto> {
    return await this._userService.getUserByName(name);
  }

  @Post('/image')
  @UseGuards(AuthGuard())
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './files',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )


  @Patch('/:id')
  updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDto> {
    return this._userService.updateUser(id, updateUserDto);
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: number): Promise<any> {
    return this._userService.deleteUser(id);
  }

}
