import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MatchRepository } from '../match/match.repository';
import { MatchStatsService } from './match_stats.service';
import { MatchStatsController } from './match_stats.controller';
import { MatchStatsRepository } from './repository/match_stats.repository';
import { TeamRepository } from 'src/modules/team/team/team.repository';
import { PlayerRepository } from 'src/modules/player/repositories/player.repository';
import { GoalRepository } from './repository/goal.repository';
import { AssistRepository } from './repository/assist.repository';
import { RedCardRepository } from './repository/red_card.repository';
import { YellowCardRepository } from './repository/yellow_card.repository';
import { PlayerStatsRepository } from 'src/modules/player/repositories/player_stats.repository';
import { TeamStatsRepository } from 'src/modules/team/team_stats/team_stats.repository';
import { TournamentMatchRepository } from 'src/modules/tournament/tournament_match/tournament_match.repository';
import { TeamTournamentRepository } from 'src/modules/tournament/team_tournament/team_tournament.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MatchStatsRepository,
      MatchRepository,
      TeamRepository,
      PlayerRepository,
      GoalRepository,
      AssistRepository,
      RedCardRepository,
      TeamStatsRepository,
      YellowCardRepository,
      PlayerStatsRepository,
      TeamTournamentRepository,
      TournamentMatchRepository,
    ]),
  ],
  controllers: [MatchStatsController],
  providers: [MatchStatsService],
  exports: [MatchStatsService],
})
export class MatchStatsModule {}
