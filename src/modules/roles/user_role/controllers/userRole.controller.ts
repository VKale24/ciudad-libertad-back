import { Controller, Get, Param } from '@nestjs/common';
import { UserRoleService } from '../services/userRole.service';

@Controller('userRole')
export class UserRoleController {
  constructor(private readonly _userRoleService: UserRoleService) {}

  @Get()
  async getUserRoles() {
    return await this._userRoleService.getUserRoles();
  }

  @Get('/user/:idUser')
  async getRolesByUser(@Param('idUser') idUser: number) {
    return await this._userRoleService.getRolesByUser(idUser);
  }
  @Get('/role/:idRole')
  async getUsersByRole(@Param('idRole') idRole: number) {
    return await this._userRoleService.getUsersByRole(idRole);
  }
}
