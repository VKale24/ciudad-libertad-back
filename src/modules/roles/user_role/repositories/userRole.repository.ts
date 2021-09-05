import { Repository, EntityRepository } from 'typeorm';
import { UserRoleEntity } from '../userRole.entity';

@EntityRepository(UserRoleEntity)
export class UserRoleRepository extends Repository<UserRoleEntity> {
    
  
}
