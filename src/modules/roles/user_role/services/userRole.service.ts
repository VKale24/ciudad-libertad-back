import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from 'src/modules/user/repositories/user.repository';
import { RoleRepository } from '../../role/repository/role.repository';
import { UserRoleRepository } from '../repositories/userRole.repository';

@Injectable()
export class UserRoleService {
  constructor(
    private readonly userRoleRepository: UserRoleRepository,
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
  ) {}

  async getUserRoles() {
    const userRoles = await this.userRoleRepository.find({
      relations: ['user', 'role'],
    });

    return userRoles;
  }

  async getRolesByUser(idUser: number) {
    const user = await this.userRepository.findOne(idUser);
    if (!user) throw new NotFoundException();

    const userRoles = await this.userRoleRepository
      .createQueryBuilder('userRole')
      .leftJoinAndSelect('userRole.user', 'user')
      .leftJoinAndSelect('userRole.role', 'role')
      .where('userRole.user.idUser = :idUser', { idUser: idUser })
      .getMany();

    return userRoles;
  }

  async getUsersByRole(idRole: number) {
    const role = await this.userRepository.findOne(idRole);
    if (!role) throw new NotFoundException();

    const userRoles = await this.userRoleRepository
      .createQueryBuilder('userRole')
      .leftJoinAndSelect('userRole.user', 'user')
      .leftJoinAndSelect('userRole.role', 'role')
      .where('userRole.role.idRole = :idRole', { idRole: idRole })
      .getMany();

    return userRoles;
  }
}
