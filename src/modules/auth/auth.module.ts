import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthRepository } from './repositories/auth.repository';
import { UserModule } from '../user/user.module';


@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: "topSecret51",
      /*signOptions: {
        expiresIn: Number(process.env.JWT_EXPIRATION_TIME)|| jwtConfig.expiresIn,
      },*/
    }),
   
    TypeOrmModule.forFeature([AuthRepository]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [
    AuthService,
    JwtStrategy,
    PassportModule
  ]
})
export class AuthModule {}
