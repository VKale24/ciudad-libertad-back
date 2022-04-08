import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { TournamentService } from './tournament.service';
import { TournamentController } from './tournament.controller';
import { TournamentRepository } from './tournament.repository';
import { TeamRepository } from '../../team/team/team.repository';
import { TeamTournamentRepository } from '../team_tournament/team_tournament.repository';
import { TeamStatsRepository } from 'src/modules/team/team_stats/team_stats.repository';
import { PlayerRepository } from 'src/modules/player/repositories/player.repository';
import { PlayerStatsRepository } from 'src/modules/player/repositories/player_stats.repository';
import { StatsTableEntity } from 'src/modules/stats_table/stats_table.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TournamentRepository,
      TeamRepository,
      TeamTournamentRepository,
      TeamStatsRepository,
      PlayerRepository,
      PlayerStatsRepository,
      StatsTableEntity
    ]),
  ],
  controllers: [TournamentController],
  providers: [TournamentService],
  exports: [TournamentService],
})
export class TournamentModule {}
