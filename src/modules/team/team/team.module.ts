import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { TeamRepository } from './team.repository';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';
import { PlayerRepository } from '../../player/repositories/player.repository';
import { TeamStatsRepository } from '../team_stats/team_stats.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TeamRepository, PlayerRepository])],
  controllers: [TeamController],
  providers: [TeamService],
  exports: [TeamService],
})
export class TeamModule {}
