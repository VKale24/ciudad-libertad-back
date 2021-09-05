import {
  Injectable,
  Logger,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../repositories/user.repository';
import { UserEntity } from '../user.entity';
import { UserDto } from '../dto/user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UserService {
  private logger = new Logger('UserService');

  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async getUsers(): Promise<UserEntity[]> {
    const users = await this.userRepository.find({});

    return users;
  }

  async getUserById(id: number): Promise<UserDto> {
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

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<UserDto> {
    var found = await this.userRepository.findOne({ idUser: id });
    if (!found) {
      throw new NotFoundException();
    }

    try {
      found = await this.userRepository.merge(found, updateUserDto);
      const result = await this.userRepository.save(found);
      return result;
    } catch (error) {
      this.logger.error(error.message, error.stack);
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
