import { Repository, EntityRepository } from 'typeorm';
import { GoalEntity } from '../entities/goal.entity';
import { MatchStatsEntity } from '../entities/match_stats.entity';

@EntityRepository(GoalEntity)
export class GoalRepository extends Repository<GoalEntity> {}
