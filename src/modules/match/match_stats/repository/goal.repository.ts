import { Repository, EntityRepository } from 'typeorm';

import { GoalEntity } from '../entities/goal.entity';

@EntityRepository(GoalEntity)
export class GoalRepository extends Repository<GoalEntity> {
  async getGoalsByMatchStats(idMatchStats: number) {
    const goals = await this.createQueryBuilder('goal')
      .leftJoinAndSelect('goal.player', 'player')
      .leftJoinAndSelect('goal.match_stats', 'match_stats')
      .leftJoinAndSelect('match_stats.match', 'match')
      .leftJoinAndSelect('match_stats.team', 'team')
      .where('match_stats.idMatchStats = :idMatchStats', {
        idMatchStats: idMatchStats,
      })
      .getMany();
      return goals;
  }
}
