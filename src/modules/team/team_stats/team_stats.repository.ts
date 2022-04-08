import { MatchStatsEntity } from 'src/modules/match/match_stats/entities/match_stats.entity';
import { PlayerEntity } from 'src/modules/player/entities/player.entity';
import { TeamTournamentRepository } from 'src/modules/tournament/team_tournament/team_tournament.repository';
import { TournamentMatchRepository } from 'src/modules/tournament/tournament_match/tournament_match.repository';
import { Repository, EntityRepository } from 'typeorm';
import { TeamRepository } from '../team/team.repository';

import { TeamStatsEntity } from './team_stats.entity';

@EntityRepository(TeamStatsEntity)
export class TeamStatsRepository extends Repository<TeamStatsEntity> {
  async addGoalToStats(
    player: PlayerEntity,
    matchStats: MatchStatsEntity,
    tournamentMatchRepository: TournamentMatchRepository,
    teamTournamentRepository: TeamTournamentRepository,
  ) {
    //**Buscando el torneo */
    const tournamentMatch = await tournamentMatchRepository.getTournamentByMatch(
      matchStats.match.idMatch,
    );

    const teamTournament = await teamTournamentRepository
      .createQueryBuilder('team_tournament')
      .leftJoin('team_tournament.player', 'player')
      .leftJoin('team_tournament.tournament', 'tournament')
      .leftJoinAndSelect('team_tournament.team_stats', 'team_stats')
      .where('team_tournament.player.idPlayer = :idPlayer', {
        idPlayer: player.idPlayer,
      })
      .andWhere('team_tournament.tournament.idTournament = :idTournament', {
        idTournament: tournamentMatch.tournament.idTournament,
      })
      .getOne();

    const teamStats = await this.findOne({
      idTeamStats: teamTournament.team_stats.idTeamStats,
    });
    teamStats.goal++;
    await this.save(teamStats);
  }

  async addAssistToStats(
    player: PlayerEntity,
    matchStats: MatchStatsEntity,
    tournamentMatchRepository: TournamentMatchRepository,
    teamTournamentRepository: TeamTournamentRepository,
  ) {
    //**Buscando el torneo */
    const tournamentMatch = await tournamentMatchRepository.getTournamentByMatch(
      matchStats.match.idMatch,
    );

    const teamTournament = await teamTournamentRepository
      .createQueryBuilder('team_tournament')
      .leftJoin('team_tournament.player', 'player')
      .leftJoin('team_tournament.tournament', 'tournament')
      .leftJoinAndSelect('team_tournament.team_stats', 'team_stats')
      .where('team_tournament.player.idPlayer = :idPlayer', {
        idPlayer: player.idPlayer,
      })
      .andWhere('team_tournament.tournament.idTournament = :idTournament', {
        idTournament: tournamentMatch.tournament.idTournament,
      })
      .getOne();

    const teamStats = await this.findOne({
      idTeamStats: teamTournament.team_stats.idTeamStats,
    });
    teamStats.assist++;
    await this.save(teamStats);
  }

  async addYellowCardToStats(
    player: PlayerEntity,
    matchStats: MatchStatsEntity,
    tournamentMatchRepository: TournamentMatchRepository,
    teamTournamentRepository: TeamTournamentRepository,
  ) {
    //**Buscando el torneo */
    const tournamentMatch = await tournamentMatchRepository.getTournamentByMatch(
      matchStats.match.idMatch,
    );

    const teamTournament = await teamTournamentRepository
      .createQueryBuilder('team_tournament')
      .leftJoin('team_tournament.player', 'player')
      .leftJoin('team_tournament.tournament', 'tournament')
      .leftJoinAndSelect('team_tournament.team_stats', 'team_stats')
      .where('team_tournament.player.idPlayer = :idPlayer', {
        idPlayer: player.idPlayer,
      })
      .andWhere('team_tournament.tournament.idTournament = :idTournament', {
        idTournament: tournamentMatch.tournament.idTournament,
      })
      .getOne();

    const teamStats = await this.findOne({
      idTeamStats: teamTournament.team_stats.idTeamStats,
    });
    teamStats.assist++;
    await this.save(teamStats);
  }

  async addRedCardToStats(
    player: PlayerEntity,
    matchStats: MatchStatsEntity,
    tournamentMatchRepository: TournamentMatchRepository,
    teamTournamentRepository: TeamTournamentRepository,
  ) {
    //**Buscando el torneo */
    const tournamentMatch = await tournamentMatchRepository.getTournamentByMatch(
      matchStats.match.idMatch,
    );

    const teamTournament = await teamTournamentRepository
      .createQueryBuilder('team_tournament')
      .leftJoin('team_tournament.player', 'player')
      .leftJoin('team_tournament.tournament', 'tournament')
      .leftJoinAndSelect('team_tournament.team_stats', 'team_stats')
      .where('team_tournament.player.idPlayer = :idPlayer', {
        idPlayer: player.idPlayer,
      })
      .andWhere('team_tournament.tournament.idTournament = :idTournament', {
        idTournament: tournamentMatch.tournament.idTournament,
      })
      .getOne();

    const teamStats = await this.findOne({
      idTeamStats: teamTournament.team_stats.idTeamStats,
    });
    teamStats.assist++;
    await this.save(teamStats);
  }
}
