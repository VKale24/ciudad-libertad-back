import { MatchStatsEntity } from 'src/modules/match/match_stats/entities/match_stats.entity';
import { PlayerEntity } from 'src/modules/player/entities/player.entity';
import { PlayerRepository } from 'src/modules/player/repositories/player.repository';
import { TeamTournamentRepository } from 'src/modules/tournament/team_tournament/team_tournament.repository';
import { TournamentMatchRepository } from 'src/modules/tournament/tournament_match/tournament_match.repository';

export class ValidationPlayer {
  static async checkIfPlayerIsInTeam(
    player: PlayerEntity,
    matchStats: MatchStatsEntity,
    teamTournamentRepository: TeamTournamentRepository,
    tournamentMatchRepository: TournamentMatchRepository,
  ) {
    const tournamentMatch = await tournamentMatchRepository
    .getTournamentByMatch(matchStats.match.idMatch);
  
    const playerAux = await teamTournamentRepository
      .createQueryBuilder('team_tournament')
      .leftJoinAndSelect('team_tournament.player', 'player')
      .leftJoinAndSelect('team_tournament.tournament', 'tournament')
      .leftJoinAndSelect('team_tournament.team', 'team')
      .where('team_tournament.player.idPlayer = :idPlayer', {
        idPlayer: player.idPlayer,
      })
      .andWhere('team_tournament.tournament.idTournament = :idTournament', {
        idTournament: tournamentMatch.tournament.idTournament,
      })
      .andWhere('team_tournament.team.idTeam = :idTeam', {
        idTeam: matchStats.team.idTeam,
      })
      .getOne();

    return playerAux ? true : false;
  }
}
