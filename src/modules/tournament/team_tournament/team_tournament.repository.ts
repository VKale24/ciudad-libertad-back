import { Repository, EntityRepository } from 'typeorm';

import { TeamTournamentEntity } from './team_tournament.entity';
import { TeamRepository } from 'src/modules/team/team/team.repository';
import { TournamentRepository } from '../tournament/tournament.repository';
import { StatsTableRepository } from 'src/modules/stats_table/stats_table.repository';

@EntityRepository(TeamTournamentEntity)
export class TeamTournamentRepository extends Repository<TeamTournamentEntity> {

  async getTableOfTournament(idTournament: number, _statsTableRepository: StatsTableRepository) {
    const teamTournaments = await this
      .createQueryBuilder('team_tournament')
      .leftJoinAndSelect('team_tournament.team', 'team')
      .leftJoinAndSelect('team_tournament.team_stats', 'team_stats')
      .leftJoinAndSelect('team_tournament.stats_table', 'stats_table')
      .leftJoinAndSelect('team_tournament.tournament', 'tournament')
      .where('team_tournament.tournament.idTournament = :idTournament', {
        idTournament: idTournament,
      })
      .orderBy('stats_table.pts', 'DESC')
      //.addOrderBy('stats_table.pg', 'DESC')
      .getMany();

    await this.updateTablePosition(teamTournaments, _statsTableRepository);

    //**RETURN LIST OF TEAM TOURNAMENTS POSITION UPDATED */
    const teamTournamentsUpdated = await this
      .createQueryBuilder('team_tournament')
      .leftJoinAndSelect('team_tournament.team', 'team')
      .leftJoinAndSelect('team_tournament.team_stats', 'team_stats')
      .leftJoinAndSelect('team_tournament.stats_table', 'stats_table')
      .leftJoinAndSelect('team_tournament.tournament', 'tournament')
      .where('team_tournament.tournament.idTournament = :idTournament', {
        idTournament: idTournament,
      })
      .orderBy('stats_table.pts', 'DESC')
      .getMany();

    /*const listTeamTournaments = this.getTeamsWithoutRepet(
      teamTournamentsUpdated,
    );*/
    //return listTeamTournaments;

    return teamTournamentsUpdated;
  }

  async updateTablePosition(teamTournaments: TeamTournamentEntity[], _statsTableRepository: StatsTableRepository) {
    for (let index = 0; index < teamTournaments.length; index++) {
      const statsTable = await _statsTableRepository.findOne(
        teamTournaments[index].stats_table.idStatsTable,
      );
      statsTable.position = index + 1;
      await _statsTableRepository.save(statsTable);
    }
  }

  async getTournamentsByTeam(idTeam: number, _teamRepository: TeamRepository) {
    const team = await _teamRepository.getTeamById(idTeam);
    //********************************* */
    //**Como devolver solamente el torneo */
    //********************************* */
    const tournaments = await this
      .createQueryBuilder('team_tournament')
      .leftJoinAndSelect('team_tournament.team', 'team')
      .leftJoinAndSelect('team_tournament.team_stats', 'team_stats')
      .leftJoinAndSelect('team_tournament.stats_table', 'stats_table')
      .leftJoinAndSelect('team_tournament.tournament', 'tournament')
      .where('team_tournament.team.idTeam = :idTeam', { idTeam: idTeam })
      .getMany();
    return tournaments;
  }

  async getTeamsByTournament(idTournament: number, _tournamentRepository: TournamentRepository) {
    const tournament = await _tournamentRepository.getTournamentById(idTournament);
    const teams = await this
      .createQueryBuilder('team_tournament')
      .leftJoinAndSelect('team_tournament.team', 'team')
      .leftJoinAndSelect('team_tournament.team_stats', 'team_stats')
      .leftJoinAndSelect('team_tournament.stats_table', 'stats_table')
      .leftJoinAndSelect('team_tournament.tournament', 'tournament')
      .where('team_tournament.tournament.idTournament = :idTournament', {
        idTournament: idTournament,
      })
      .getMany();
    return teams;
  }

  async getTeamTournamentByTeamAndTournament(
    idTeam: number,
    idTournament: number,
    teamRepository: TeamRepository,
    tournamentRepository: TournamentRepository,
    teamTournamentRepository: TeamTournamentRepository,
  ) {
    const team = await teamRepository.getTeamById(idTeam);
    const tournament = await tournamentRepository.getTournamentById(idTournament);

    const teamTournament = await teamTournamentRepository
      .createQueryBuilder('team_tournament')
      .leftJoinAndSelect('team_tournament.team', 'team')
      .leftJoinAndSelect('team_tournament.team_stats', 'team_stats')
      .leftJoinAndSelect('team_tournament.stats_table', 'stats_table')
      .leftJoinAndSelect('team_tournament.tournament', 'tournament')
      .where('team_tournament.tournament.idTournament = :idTournament', {
        idTournament: idTournament,
      })
      .andWhere('team_tournament.team.idTeam = :idTeam', {
        idTeam: idTeam,
      })
      .getOne();
    return teamTournament;
  }


  /*async getAllTeamsTournamentsOfPlayer(
    idPlayer: number,
    playerRepository: PlayerRepository,
  ) {
    const player = await playerRepository.findOne(idPlayer);
    if (player) {
      const teamTournament = await this.createQueryBuilder('team_tournament')
        .leftJoinAndSelect('team_tournament.team', 'team')
        .leftJoinAndSelect('team_tournament.player', 'player')
        .leftJoinAndSelect('team_tournament.team_stats', 'team_stats')
        .leftJoinAndSelect('team_tournament.stats_table', 'stats_table')
        .leftJoinAndSelect('team_tournament.tournament', 'tournament')
        .where('team_tournament.player.idPlayer = :idPlayer', {
          idPlayer: idPlayer,
        })
        .getMany();

      return teamTournament;
    } else throw new NotFoundException();
  }*/
}
