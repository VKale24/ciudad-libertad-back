import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { TournamentMatchRepository } from './tournament_match.repository';
import { MatchRepository } from 'src/modules/match/match/match.repository';
import { TournamentRepository } from '../tournament/tournament.repository';
import { TeamMatchRepository } from 'src/modules/team/team_match/team_match.repository';

@Injectable()
export class TournamentMatchService {
  @InjectRepository(TournamentMatchRepository)
  private readonly _tournamentMatchRepository: TournamentMatchRepository;

  @InjectRepository(TournamentRepository)
  private readonly _tournamentRepository: TournamentRepository;

  @InjectRepository(MatchRepository)
  private readonly _matchRepository: MatchRepository;

  @InjectRepository(TeamMatchRepository)
  private readonly _teamMatchRepository: TeamMatchRepository;

  async getTournamentByMatch(idMatch: number) {
    const tournament = await this._tournamentMatchRepository.getTournamentByMatch(
      idMatch, this._matchRepository);

    return tournament;
  }

  async getMatchsByTournament(idTournament: number) {
    await this._tournamentRepository.getTournamentById(idTournament);

    const matchs = await this._tournamentMatchRepository.getMatchsByTournament(
      idTournament, this._teamMatchRepository);

    return matchs;
  }

  async getMatchsOfTournamentByRound(idTournament: number, round: number) {
    await this._tournamentRepository.getTournamentById(idTournament);
    const matchs = await this._tournamentMatchRepository.getMatchsOfTournamentByRound(
      idTournament, this._teamMatchRepository, round
    );

    return matchs;
  }
}
