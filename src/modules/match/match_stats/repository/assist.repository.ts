import { Repository, EntityRepository } from 'typeorm';
import { AssistEntity } from '../entities/assist.entity';

@EntityRepository(AssistEntity)
export class AssistRepository extends Repository<AssistEntity> {}
