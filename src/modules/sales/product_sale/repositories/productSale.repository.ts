import { Repository, EntityRepository } from 'typeorm';
import { ProductSaleEntity } from '../productSale.entity';

@EntityRepository(ProductSaleEntity)
export class ProductSaleRepository extends Repository<ProductSaleEntity> {
    
  
}
