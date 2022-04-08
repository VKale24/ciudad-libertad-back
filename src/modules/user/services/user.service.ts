import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as fs from 'fs';
import { InjectRepository } from '@nestjs/typeorm';

import { UserDto } from '../dto/user.dto';
import { UserEntity } from '../user.entity';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async getUsers(): Promise<UserEntity[]> {
    const users = await this.userRepository.find({});

    return users;
  }

  async getUserById(id: number): Promise<UserEntity> {
    const found: UserEntity = await this.userRepository.findOne({
      where: { idUser: id },
    });

    if (!found) {
      throw new NotFoundException();
    }
    return found;
  }

  async getUserByName(username: string): Promise<UserDto> {
    const found: UserEntity = await this.userRepository.findOne({
      where: { username: username },
    });

    if (!found) {
      throw new NotFoundException();
    }
    return found;
  }
/*
  async uploadImageToUser(userDto: UserDto, file: any) {
    const user = await this.userRepository.findOne({
      username: userDto.username,
    });
    var pathToFile;

    if (!user) throw new NotFoundException();

    if(user.image!="no image")
    pathToFile = `./files/${user.image}`;

    try {
      fs.unlinkSync(pathToFile);
      //file removed
    } catch (err) {
      console.error(err);
    }

    if (file != null) user.image = file.filename;

    await this.userRepository.save(user);
   
    
    return user;
  }
*/
  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<UserDto> {
    var found = await this.getUserById(id);

    try {
      found = await this.userRepository.merge(found, updateUserDto);
      const result = await this.userRepository.save(found);
      return result;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async deleteUser(id: number): Promise<any> {
    const result = await this.userRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException();
    }

    return Promise.resolve({
      result: result,
      status: 'success',
    });
  }
}
