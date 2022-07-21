import { Repository, EntityRepository } from 'typeorm';

import { RedCardEntity } from '../entities/red_card.entity';

@EntityRepository(RedCardEntity)
export class RedCardRepository extends Repository<RedCardEntity> {}
