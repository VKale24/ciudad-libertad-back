import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TeamTournamentService } from './team_tournament.service';
import { TeamRepository } from 'src/modules/team/team/team.repository';
import { TeamTournamentController } from './team_tournament.controller';
import { TeamTournamentRepository } from './team_tournament.repository';
import { TournamentRepository } from '../tournament/tournament.repository';
import { PlayerRepository } from 'src/modules/player/repositories/player.repository';
import { StatsTableRepository } from 'src/modules/stats_table/stats_table.repository';


@Module({
  imports: [TypeOrmModule.forFeature([TeamTournamentRepository, TeamRepository, TournamentRepository, PlayerRepository, StatsTableRepository])],
  controllers: [TeamTournamentController],
  providers: [TeamTournamentService],
  exports: [TeamTournamentService],
})
export class TeamTournamentModule { }
