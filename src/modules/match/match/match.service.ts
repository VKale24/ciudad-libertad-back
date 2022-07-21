import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { MatchDto } from './dto/match.dto';
import { MatchRepository } from './match.repository';
import { TeamRepository } from '../../team/team/team.repository';
import { TeamMatchRepository } from '../../team/team_match/team_match.repository';
import { StatsTableRepository } from 'src/modules/stats_table/stats_table.repository';
import { MatchStatsRepository } from '../match_stats/repository/match_stats.repository';
import { TournamentRepository } from '../../tournament/tournament/tournament.repository';
import { TournamentMatchRepository } from '../../tournament/tournament_match/tournament_match.repository';
import { TeamTournamentRepository } from 'src/modules/tournament/team_tournament/team_tournament.repository';

@Injectable()
export class MatchService {

  @InjectRepository(TeamRepository)
  private readonly _teamRepository: TeamRepository;

  @InjectRepository(MatchRepository)
  private readonly _matchRepository: MatchRepository;

  @InjectRepository(TeamMatchRepository)
  private readonly _teamMatchRepository: TeamMatchRepository;

  @InjectRepository(TournamentRepository)
  private readonly _tournamentRepository: TournamentRepository;

  @InjectRepository(MatchStatsRepository)
  private readonly _matchStatsRepository: MatchStatsRepository;

  @InjectRepository(StatsTableRepository)
  private readonly _statsTableRepository: StatsTableRepository;

  @InjectRepository(TeamTournamentRepository)
  private readonly _teamTournamentRepository: TeamTournamentRepository;

  @InjectRepository(TournamentMatchRepository)
  private readonly _tournamentMatchRepository: TournamentMatchRepository;

  async getAllMatchs() {
    return await this._matchRepository.getAllMatchs();
  }

  async getMatchById(idMatch: number) {
    return await this._matchRepository.getMatchById(idMatch);
  }

  async getMatchsByRound(round: number, idTournament: number) {
    const match = await this._matchRepository.find({ round: round });

    if (!match) throw new NotFoundException();

    return match;
  }

  async createMatch(
    matchDto: MatchDto,
    idTeam1: number,
    idTeam2: number,
    idTournament: number,
  ) {
    return await this._matchRepository.create_match(idTeam1, idTeam2, idTournament, matchDto, this._teamRepository, this._tournamentRepository, this._teamTournamentRepository, this._teamMatchRepository, this._tournamentMatchRepository);
  }

  async updateMatch(idMatch: number, matchDto: MatchDto) {
    return await this._matchRepository.updateMatch(idMatch, matchDto);
  }

  async closeMatch(idMatch: number) {
    return await this._matchRepository.closeMatch(idMatch, this._tournamentMatchRepository, this._teamMatchRepository, this._matchStatsRepository, this._teamRepository, this._tournamentRepository, this._statsTableRepository, this._teamTournamentRepository, this._matchRepository);
  }


  async deleteMatch(idMatch: number) {
    return this._matchRepository.deletMatch(idMatch);
  }
}
