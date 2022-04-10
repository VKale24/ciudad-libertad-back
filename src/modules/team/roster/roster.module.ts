import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { PlayerRepository } from '../../player/repositories/player.repository';
import { TeamRepository } from '../team/team.repository';
import { RosterController } from './roster.controller';
import { RosterService } from './roster.service';
import { PlayerStatsRepository } from 'src/modules/player/repositories/player_stats.repository';
import { RosterRepository } from './roster.repository';
import { TeamTournamentRepository } from 'src/modules/tournament/team_tournament/team_tournament.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RosterRepository,
      TeamRepository,
      PlayerRepository,
      PlayerStatsRepository,
      TeamTournamentRepository
    ]),
  ],
  controllers: [RosterController],
  providers: [RosterService],
  exports: [RosterService],
})
export class RosterModule {}
