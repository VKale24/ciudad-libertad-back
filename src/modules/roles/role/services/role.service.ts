import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from 'src/modules/user/repositories/user.repository';
import { UserRoleRepository } from '../../user_role/repositories/userRole.repository';
import { UserRoleEntity } from '../../user_role/userRole.entity';
import { RoleRepository } from '../repository/role.repository';
import { RoleEntity } from '../role.entity';

@Injectable()
export class RoleService {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly userRepository: UserRepository,
    private readonly userRoleRepository: UserRoleRepository,
  ) {}

  async getRoles() {
    const roles = await this.roleRepository.find();

    return roles;
  }
  async getRoleById(idRole: number) {
    const role = await this.roleRepository.findOne(idRole);

    if (!role) throw new NotFoundException();
    return role;
  }

  async createRole(name: string) {
    try {
      const role = new RoleEntity(name);
      await this.roleRepository.save(role);
      return role;
    } catch (error) {
      if (error.code === '23505') {
        // duplicate name role
        throw new ConflictException('Name of the company already exists');
      }
    }
  }
  async assignRoleToUser(idUsers: number[], idRole: number) {
    if (!idRole) throw new NotFoundException();

    const role = await this.roleRepository.findOne(idRole);
    if (!role) throw new NotFoundException();

    if (idUsers.length != 0) {
      idUsers.map(async (userId) => {
        const user = await this.userRepository.findOne(userId);

        //check if the user already has a role selected previously
        const found = await this.userRoleRepository
          .createQueryBuilder('userRole')
          .leftJoinAndSelect('userRole.user', 'user')
          .leftJoinAndSelect('userRole.role', 'role')
          .where('userRole.user.idUser = :idUser', { idUser: user.idUser })
          .andWhere('userRole.role.idRole = :idRole', { idRole: idRole })
          .getOne();

        //if(found) throw new ConflictException("The user selected already has that role")
        if (!found) {
          const userRole = new UserRoleEntity(user, role);
          await this.userRoleRepository.save(userRole);
        }
      });
    }
    return 'success';
  }

  async quitRoleToUser(idUser: number, idRole: number) {
    if (!idRole) throw new NotFoundException();

    const role = await this.roleRepository.findOne(idRole);
    if (!role) throw new NotFoundException();

    const user = await this.userRepository.findOne(idUser);

    if (!user) throw new NotFoundException();

    const found = await this.userRoleRepository
      .createQueryBuilder('userRole')
      .leftJoinAndSelect('userRole.user', 'user')
      .leftJoinAndSelect('userRole.role', 'role')
      .where('userRole.user.idUser = :idUser', { idUser: user.idUser })
      .andWhere('userRole.role.idRole = :idRole', { idRole: idRole })
      .getOne();

    if (!found) throw new NotFoundException();

    if (found) {
      const result = await this.userRoleRepository.delete(found);
      return Promise.resolve({
        result: result,
        status: 'success',
      });
    }
  }

  async updateRole(idRole: number, name: string): Promise<RoleEntity> {
    const role = await this.getRoleById(idRole);

    if (!name) throw new NotFoundException();
    role.name = name;

    await this.roleRepository.save(role);

    return role;
  }

  async deleteRole(idRole: number) {
    const role = await this.getRoleById(idRole);

    const result = await this.roleRepository.delete(role);

    return Promise.resolve({
      result: result,
      status: 'success',
    });
  }
}
