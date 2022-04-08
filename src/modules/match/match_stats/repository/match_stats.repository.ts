import { NotFoundException } from '@nestjs/common';
import { Repository, EntityRepository } from 'typeorm';
import { MatchRepository } from '../../match/match.repository';
import { MatchStatsEntity } from '../entities/match_stats.entity';

@EntityRepository(MatchStatsEntity)
export class MatchStatsRepository extends Repository<MatchStatsEntity> {

    async getStatsByMatchAndTeam(idMatch: number, idTeam: number, matchRepository: MatchRepository) {
        const match = await matchRepository.findOne(idMatch);
    
        if (match) {
          const stats = await this
            .createQueryBuilder('match_stats')
            .leftJoinAndSelect('match_stats.match', 'match')
            .leftJoinAndSelect('match_stats.team', 'team')
            .where('match_stats.match.idMatch = :idMatch', { idMatch: idMatch })
            .andWhere('match_stats.team.idTeam = :idTeam', { idTeam: idTeam })
            .getOne();
    
          return stats;
        } else throw new NotFoundException();
      }
}
