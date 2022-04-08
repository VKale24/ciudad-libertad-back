import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchRepository } from 'src/modules/match/match/match.repository';
import { TeamMatchRepository } from 'src/modules/team/team_match/team_match.repository';
import { TournamentRepository } from '../tournament/tournament.repository';
import { TournamentMatchRepository } from './tournament_match.repository';

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
    const match = await this._matchRepository.findOne(idMatch);
    if (match) {
      const tournament = await this._tournamentMatchRepository.getTournamentByMatch(
        idMatch,
      );

      return tournament;
    } else throw new NotFoundException();
  }

  async getMatchsByTournament(idTournament: number) {
    const tournament = await this._tournamentRepository.findOne(idTournament);
    if (tournament) {
      const matchs = await this._tournamentMatchRepository.getMatchsByTournament(
        idTournament, this._teamMatchRepository
      );

      return matchs;
    } else throw new NotFoundException();
  }

  async getMatchsOfTournamentByRound(idTournament: number, round: number) {
    const tournament = await this._tournamentRepository.findOne(idTournament);
    if (tournament) {
      const matchs = await this._tournamentMatchRepository.getMatchsOfTournamentByRound(
        idTournament, this._teamMatchRepository, round
      );

      return matchs;
    } else throw new NotFoundException();
  }
}
