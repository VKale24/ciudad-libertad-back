import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { RoleEntity } from '../role.entity';
import { RoleService } from '../services/role.service';

@Controller('role')
export class RoleController {
  constructor(private readonly _roleService: RoleService) {}
  @Get()
  async getRoles(): Promise<RoleEntity[]> {
    return await this._roleService.getRoles();
  }

  @Get('/:id')
  async getRoleById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<RoleEntity> {
    return await this._roleService.getRoleById(id);
  }

  @Post()
  async createRole(@Body('name') name: string): Promise<RoleEntity> {
    return await this._roleService.createRole(name);
  }

  @Post('assign/:idRole')
  async assignRoleToUser(
    @Param('idRole', ParseIntPipe) idRole: number,
    @Body('users')
    users: [id: number],
  ): Promise<string> {
    return await this._roleService.assignRoleToUser(users, idRole);
  }

  @Post('unassign/:idRole')
  async quitRoleToUser(
    @Param('idRole', ParseIntPipe) idRole: number,
    @Body('idUser', ParseIntPipe) idUser: number,
  ) {
    return await this._roleService.quitRoleToUser(idUser, idRole);
  }

  @Patch('/:id')
  async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body('name') name: string,
  ): Promise<RoleEntity> {
    return await this._roleService.updateRole(id, name);
  }

  @Delete('/:id')
  async deleteRole(@Param('id') id: number) {
    return await this._roleService.deleteRole(id);
  }
}
