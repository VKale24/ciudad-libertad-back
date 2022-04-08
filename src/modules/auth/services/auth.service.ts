import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';

import { UserDto } from 'src/modules/user/dto/user.dto';
import { UserEntity } from 'src/modules/user/user.entity';
import { LoginCredentials } from '../dto/login-credentials.dto';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { AuthRepository } from '../repositories/auth.repository';
import { RegisterCredentials } from '../dto/register-credentials.dto';


@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(
            @InjectRepository(AuthRepository) private authRepository: AuthRepository,
            private jwtService: JwtService,
          ) {}

  async signUp(registerCredentialsDto: RegisterCredentials): Promise<UserDto> {
    return await this.authRepository.signUp(registerCredentialsDto);
  }

  async signIn(loginCredentialsDto: LoginCredentials): Promise<{ accessToken: string }> {
    const username = await this.authRepository.validateUserPassword(loginCredentialsDto);

    if (!username) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = { username };
    const accessToken = await this.jwtService.sign(payload);
    this.logger.debug(`Generated JWT Token with payload ${JSON.stringify(payload)}`);

    return { accessToken };
  }

  getAuthenticatedUser(user: UserEntity) : UserDto{
    return  plainToClass(UserDto,  user);
  }
}
