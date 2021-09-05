import { ProductEntity } from 'src/modules/products/product/product.entity';
import { UserEntity } from 'src/modules/user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { RoleEntity } from '../role/role.entity';

@Entity({ name: 'userRole' })
export class UserRoleEntity {
  @PrimaryGeneratedColumn()
  idUserRole: number;

  @ManyToOne((type) => UserEntity, (user) => user.idUser, {
    eager: false,
  })
  user: UserEntity;

  @ManyToOne((type) => RoleEntity, (role) => role.idRole, {
    eager: false,
  })
  role: RoleEntity;

  constructor(user: UserEntity, role: RoleEntity) {
    this.user = user;
    this.role = role;
  }
}
