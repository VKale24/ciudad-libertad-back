import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/modules/user/repositories/user.repository';
import { RoleRepository } from '../role/repository/role.repository';
import { UserRoleController } from './controllers/userRole.controller';
import { UserRoleRepository } from './repositories/userRole.repository';
import { UserRoleService } from './services/userRole.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserRoleRepository, UserRepository, RoleRepository])],
  controllers: [UserRoleController],
  providers: [UserRoleService],
  exports: [UserRoleService],
})
export class UserRoleModule {}
