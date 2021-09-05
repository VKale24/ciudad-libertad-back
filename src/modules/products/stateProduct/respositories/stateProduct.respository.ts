import { Repository, EntityRepository } from 'typeorm';
import { StateProductEntity } from '../stateProduct.entity';

@EntityRepository(StateProductEntity)
export class StateProductRepository extends Repository<StateProductEntity> {}
