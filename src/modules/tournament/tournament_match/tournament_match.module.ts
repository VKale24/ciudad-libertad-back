import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TournamentRepository } from '../tournament/tournament.repository';
import { TournamentMatchRepository } from './tournament_match.repository';
import { TournamentMatchController } from './tournament_match.controller';
import { TournamentMatchService } from './tournament_match.service';
import { MatchRepository } from 'src/modules/match/match/match.repository';
import { TeamMatchRepository } from 'src/modules/team/team_match/team_match.repository';


@Module({
  imports: [TypeOrmModule.forFeature([TournamentRepository, TournamentMatchRepository, TeamMatchRepository, MatchRepository])],
  controllers: [TournamentMatchController],
  providers: [TournamentMatchService],
  exports: [TournamentMatchService],
})
export class TournamentMatchModule {}
