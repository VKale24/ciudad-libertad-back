import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { ImageModule } from '../images/image.module';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { UserRepository } from './repositories/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository]), AuthModule, ImageModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
