import { NotFoundException } from '@nestjs/common';
import { Repository, EntityRepository } from 'typeorm';

import { TeamEntity } from './team.entity';

@EntityRepository(TeamEntity)
export class TeamRepository extends Repository<TeamEntity> {

    async getTeamById(idTeam: number): Promise<TeamEntity> {
        const found: TeamEntity = await this.findOne({
          where: { idTeam: idTeam },
        });
    
        if (!found) {
          throw new NotFoundException();
        }
    
        return found;
      }
}
