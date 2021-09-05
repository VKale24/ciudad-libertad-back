import { Repository, EntityRepository } from 'typeorm';
import { SaleEntity } from '../sale.entity';

@EntityRepository(SaleEntity)
export class SaleRepository extends Repository<SaleEntity> {
    
  
}
