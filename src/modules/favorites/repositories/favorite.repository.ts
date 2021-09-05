import { Repository, EntityRepository } from 'typeorm';
import { FavoriteEntity } from '../favorite.entity';

@EntityRepository(FavoriteEntity)
export class FavoriteRepository extends Repository<FavoriteEntity> {}
