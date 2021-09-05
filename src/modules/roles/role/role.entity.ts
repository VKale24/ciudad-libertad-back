import {
    Entity,
    Column,
    Unique,
    PrimaryGeneratedColumn,
    OneToMany,
  } from 'typeorm';
  import { ProductEntity } from '../../products/product/product.entity';
import { UserRoleEntity } from '../user_role/userRole.entity';
  
  @Entity({ name: 'role' })
  @Unique(['name'])
  export class RoleEntity {
    @PrimaryGeneratedColumn()
    idRole: number;
  
    @Column({ unique: true, nullable: false })
    name: string;
  
    @OneToMany(type => UserRoleEntity, userRole => userRole.role, {cascade: true})
    userRole: UserRoleEntity[]
  
    constructor(name: string) {
      this.name = name;
    }
  }
  