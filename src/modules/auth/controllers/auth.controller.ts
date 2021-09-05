import { Controller, Post, Body, ValidationPipe, Get, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/common/decorators';
import { AuthGuard } from 'src/common/guards';
import { UserDto } from 'src/modules/user/dto/user.dto';
import { UserService } from 'src/modules/user/services/user.service';
import { UserEntity } from 'src/modules/user/user.entity';
import { LoginCredentials } from '../dto/login-credentials.dto';
import { RegisterCredentials } from '../dto/register-credentials.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    ) {}

  @Post('/signup')
  signUp(@Body() registerCredentialsDto: RegisterCredentials): Promise<UserDto> {
    return this.authService.signUp(registerCredentialsDto);
  }

  @Post('/signin')
  signIn(@Body(ValidationPipe) loginCredentialsDto: LoginCredentials): Promise<{ accessToken: string }> {
    return this.authService.signIn(loginCredentialsDto);
  }

  @Get('/authenticated')
  @UseGuards(AuthGuard)
  getAuthenticatedUser(@GetUser() user: UserEntity):  UserDto {
    return this.authService.getAuthenticatedUser(user);
  }
}
