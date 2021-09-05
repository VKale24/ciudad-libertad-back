import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/modules/user/repositories/user.repository';
import { UserRoleRepository } from '../user_role/repositories/userRole.repository';
import { RoleController } from './controllers/role.controller';
import { RoleRepository } from './repository/role.repository';
import { RoleService } from './services/role.service';

@Module({
  imports: [TypeOrmModule.forFeature([RoleRepository, UserRepository, UserRoleRepository])],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
