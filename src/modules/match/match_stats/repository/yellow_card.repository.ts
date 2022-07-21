import { Repository, EntityRepository } from 'typeorm';

import { YellowCardEntity } from '../entities/yellow_card.entity';

@EntityRepository(YellowCardEntity)
export class YellowCardRepository extends Repository<YellowCardEntity> {}
