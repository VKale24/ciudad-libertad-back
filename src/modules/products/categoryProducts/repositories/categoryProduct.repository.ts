import { Repository, EntityRepository } from 'typeorm';
import { CategoryProductEntity } from '../categoryProduct.entity';

@EntityRepository(CategoryProductEntity)
export class CategoryProductRepository extends Repository<CategoryProductEntity> {}
