import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MatchStatsService } from './match_stats.service';
import { MatchRepository } from '../match/match.repository';
import { GoalRepository } from './repository/goal.repository';
import { MatchStatsController } from './match_stats.controller';
import { AssistRepository } from './repository/assist.repository';
import { RedCardRepository } from './repository/red_card.repository';
import { TeamRepository } from 'src/modules/team/team/team.repository';
import { MatchStatsRepository } from './repository/match_stats.repository';
import { YellowCardRepository } from './repository/yellow_card.repository';
import { RosterRepository } from 'src/modules/team/roster/roster.repository';
import { PlayerRepository } from 'src/modules/player/repositories/player.repository';
import { TeamStatsRepository } from 'src/modules/team/team_stats/team_stats.repository';
import { TournamentRepository } from 'src/modules/tournament/tournament/tournament.repository';
import { PlayerStatsRepository } from 'src/modules/player/repositories/player_stats.repository';
import { TeamTournamentRepository } from 'src/modules/tournament/team_tournament/team_tournament.repository';
import { TournamentMatchRepository } from 'src/modules/tournament/tournament_match/tournament_match.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MatchRepository,
      TeamRepository,
      GoalRepository,
      PlayerRepository,
      RosterRepository,
      AssistRepository,
      RedCardRepository,
      TeamStatsRepository,
      YellowCardRepository,
      TournamentRepository,
      MatchStatsRepository,
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
