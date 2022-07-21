import { Repository, EntityRepository } from 'typeorm';

import { TeamStatsEntity } from './team_stats.entity';
import { RosterRepository } from '../roster/roster.repository';
import { PlayerEntity } from 'src/modules/player/entities/player.entity';
import { PlayerRepository } from 'src/modules/player/repositories/player.repository';
import { MatchStatsEntity } from 'src/modules/match/match_stats/entities/match_stats.entity';
import { TournamentRepository } from 'src/modules/tournament/tournament/tournament.repository';
import { TeamTournamentRepository } from 'src/modules/tournament/team_tournament/team_tournament.repository';
import { TournamentMatchRepository } from 'src/modules/tournament/tournament_match/tournament_match.repository';

@EntityRepository(TeamStatsEntity)
export class TeamStatsRepository extends Repository<TeamStatsEntity> {
  async addGoalToStats(
    player: PlayerEntity,
    matchStats: MatchStatsEntity,
    playerRepository: PlayerRepository,
    tournamentRepository: TournamentRepository,
    tournamentMatchRepository: TournamentMatchRepository,
    teamTournamentRepository: TeamTournamentRepository,
    rosterRepository: RosterRepository,
  ) {
    //**Buscando el torneo */
    const tournamentMatch = await tournamentMatchRepository.getTournamentByMatch(
      matchStats.match.idMatch,
    );

    const roster = await rosterRepository.getRosterByPlayerAndTournament(
      player.idPlayer,
      tournamentMatch.tournament.idTournament,
      playerRepository,
      tournamentRepository,
    );

    const teamTournament = await teamTournamentRepository
      .createQueryBuilder('team_tournament')
      .leftJoin('team_tournament.tournament', 'tournament')
      .leftJoin('team_tournament.team', 'team')
      .leftJoinAndSelect('team_tournament.team_stats', 'team_stats')
      .where('team.idTeam = :idTeam', { idTeam: roster.team.idTeam })
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
    playerRepository: PlayerRepository,
    tournamentRepository: TournamentRepository,
    tournamentMatchRepository: TournamentMatchRepository,
    teamTournamentRepository: TeamTournamentRepository,
    rosterRepository: RosterRepository,
  ) {
    //**Buscando el torneo */
    const tournamentMatch = await tournamentMatchRepository.getTournamentByMatch(
      matchStats.match.idMatch,
    );

    const roster = await rosterRepository.getRosterByPlayerAndTournament(
      player.idPlayer,
      tournamentMatch.tournament.idTournament,
      playerRepository,
      tournamentRepository,
    );

    const teamTournament = await teamTournamentRepository
      .createQueryBuilder('team_tournament')
      .leftJoin('team_tournament.tournament', 'tournament')
      .leftJoin('team_tournament.team', 'team')
      .leftJoinAndSelect('team_tournament.team_stats', 'team_stats')
      .where('team.idTeam = :idTeam', { idTeam: roster.team.idTeam })
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
  async addYellowCardToStats(
    player: PlayerEntity,
    matchStats: MatchStatsEntity,
    playerRepository: PlayerRepository,
    tournamentRepository: TournamentRepository,
    tournamentMatchRepository: TournamentMatchRepository,
    teamTournamentRepository: TeamTournamentRepository,
    rosterRepository: RosterRepository,
  ) {
    //**Buscando el torneo */
    const tournamentMatch = await tournamentMatchRepository.getTournamentByMatch(
      matchStats.match.idMatch,
    );

    const roster = await rosterRepository.getRosterByPlayerAndTournament(
      player.idPlayer,
      tournamentMatch.tournament.idTournament,
      playerRepository,
      tournamentRepository,
    );

    const teamTournament = await teamTournamentRepository
      .createQueryBuilder('team_tournament')
      .leftJoin('team_tournament.tournament', 'tournament')
      .leftJoin('team_tournament.team', 'team')
      .leftJoinAndSelect('team_tournament.team_stats', 'team_stats')
      .where('team.idTeam = :idTeam', { idTeam: roster.team.idTeam })
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
  async addRedCardToStats(
    player: PlayerEntity,
    matchStats: MatchStatsEntity,
    playerRepository: PlayerRepository,
    tournamentRepository: TournamentRepository,
    tournamentMatchRepository: TournamentMatchRepository,
    teamTournamentRepository: TeamTournamentRepository,
    rosterRepository: RosterRepository,
  ) {
    //**Buscando el torneo */
    const tournamentMatch = await tournamentMatchRepository.getTournamentByMatch(
      matchStats.match.idMatch,
    );

    const roster = await rosterRepository.getRosterByPlayerAndTournament(
      player.idPlayer,
      tournamentMatch.tournament.idTournament,
      playerRepository,
      tournamentRepository,
    );

    const teamTournament = await teamTournamentRepository
      .createQueryBuilder('team_tournament')
      .leftJoin('team_tournament.tournament', 'tournament')
      .leftJoin('team_tournament.team', 'team')
      .leftJoinAndSelect('team_tournament.team_stats', 'team_stats')
      .where('team.idTeam = :idTeam', { idTeam: roster.team.idTeam })
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

}
