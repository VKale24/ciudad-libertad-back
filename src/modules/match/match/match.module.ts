import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsTableRepository } from 'src/modules/stats_table/stats_table.repository';
import { TeamTournamentRepository } from 'src/modules/tournament/team_tournament/team_tournament.repository';
import { TeamRepository } from '../../team/team/team.repository';
import { TeamMatchRepository } from '../../team/team_match/team_match.repository';
import { TournamentRepository } from '../../tournament/tournament/tournament.repository';
import { TournamentMatchRepository } from '../../tournament/tournament_match/tournament_match.repository';
import { MatchStatsRepository } from '../match_stats/repository/match_stats.repository';
import { MatchController } from './match.controller';

import { MatchRepository } from './match.repository';
import { MatchService } from './match.service';


@Module({
  imports: [TypeOrmModule.forFeature([ MatchRepository, TeamRepository, TeamMatchRepository, TournamentRepository, TournamentMatchRepository, TeamTournamentRepository, MatchStatsRepository, StatsTableRepository ])],
  controllers: [MatchController],
  providers: [MatchService],
  exports: [MatchService],
})
export class MatchModule {}
