import { Repository, EntityRepository } from 'typeorm';

import { TournamentMatchEntity } from './tournament_match.entity';
import { MatchRepository } from 'src/modules/match/match/match.repository';
import { TeamMatchRepository } from 'src/modules/team/team_match/team_match.repository';

@EntityRepository(TournamentMatchEntity)
export class TournamentMatchRepository extends Repository<TournamentMatchEntity> {
  async getTournamentByMatch(idMatch: number) {

    const tournament = await this.createQueryBuilder('tournament_match')
      .leftJoinAndSelect('tournament_match.match', 'match')
      .leftJoinAndSelect('tournament_match.tournament', 'tournament')
      .where('tournament_match.match.idMatch = :idMatch', {
        idMatch: idMatch,
      })
      .getOne();
    return tournament;
  }

  async getMatchsByTournament(idTournament: number, _teamMatchRepository: TeamMatchRepository) {
    const matchs = await this.createQueryBuilder('tournament_match')
      .leftJoinAndSelect('tournament_match.tournament', 'tournament')
      .leftJoinAndSelect('tournament_match.match', 'match')
      .where('tournament_match.tournament.idTournament = :idTournament', {
        idTournament: idTournament,
      })
      .orderBy("tournament.created_at", "DESC")
      .getMany();

    return matchs;
  }

  async getMatchsOfTournamentByRound(idTournament: number, _teamMatchRepository: TeamMatchRepository, round: number) {
    const matchsRound = await this.createQueryBuilder('tournament_match')
      .leftJoinAndSelect('tournament_match.tournament', 'tournament')
      .leftJoinAndSelect('tournament_match.match', 'match')
      .where('tournament_match.tournament.idTournament = :idTournament', {
        idTournament: idTournament,
      })
      .andWhere('match.round = :round', {
        round: round,
      })
      .getMany();

    return matchsRound;
  }
}
