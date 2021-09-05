import { Repository, EntityRepository } from 'typeorm';
import { CommentEntity } from '../comments.entity';

@EntityRepository(CommentEntity)
export class CommentRepository extends Repository<CommentEntity> {}
