import { Repository, EntityRepository } from 'typeorm';
import { CartProductEntity } from '../cartProduct.entity';

@EntityRepository(CartProductEntity)
export class CartProductRepository extends Repository<CartProductEntity> {
    
  
}
