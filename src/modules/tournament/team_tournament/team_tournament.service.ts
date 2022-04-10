import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlayerRepository } from 'src/modules/player/repositories/player.repository';
import { StatsTableRepository } from 'src/modules/stats_table/stats_table.repository';
import { TeamRepository } from 'src/modules/team/team/team.repository';
import { TournamentRepository } from '../tournament/tournament.repository';
import { TeamTournamentEntity } from './team_tournament.entity';

import { TeamTournamentRepository } from './team_tournament.repository';

@Injectable()
export class TeamTournamentService {
  @InjectRepository(TeamTournamentRepository)
  private readonly _teamTournamentRepository: TeamTournamentRepository;

  @InjectRepository(TeamRepository)
  private readonly _teamRepository: TeamRepository;

  @InjectRepository(TournamentRepository)
  private readonly _tournamentRepository: TournamentRepository;

  @InjectRepository(StatsTableRepository)
  private readonly _statsTableRepository: StatsTableRepository;

  @InjectRepository(PlayerRepository)
  private readonly _playerRepository: PlayerRepository;

  async getTableOfTournament(idTournament: number) {
    const teamTournaments = await this._teamTournamentRepository
      .createQueryBuilder('team_tournament')
      .leftJoinAndSelect('team_tournament.team', 'team')
      .leftJoinAndSelect('team_tournament.team_stats', 'team_stats')
      .leftJoinAndSelect('team_tournament.stats_table', 'stats_table')
      .leftJoinAndSelect('team_tournament.tournament', 'tournament')
      .where('team_tournament.tournament.idTournament = :idTournament', {
        idTournament: idTournament,
      })
      .distinct(true)
      .orderBy('stats_table.pts', 'DESC')
      //.addOrderBy('stats_table.pg', 'DESC')
      .getMany();

    await this.updateTablePosition(teamTournaments);

    //**RETURN LIST OF TEAM TOURNAMENTS POSITION UPDATED */
    const teamTournamentsUpdated = await this._teamTournamentRepository
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

    const listTeamTournaments = this.getTeamsWithoutRepet(
      teamTournamentsUpdated,
    );
    return listTeamTournaments;
  }
  //OBTENER LOS EQUIPOS SIN REPETICION PARA SACAR LA TABLA
  getTeamsWithoutRepet(teamTournaments: TeamTournamentEntity[]) {
    var listTeamID: number[] = [];
    let listTeamTournament: TeamTournamentEntity[] = [];
    for (let i = 0; i < teamTournaments.length; i++) {
      if (listTeamID.length == 0) {
        listTeamID.push(teamTournaments[i].team.idTeam);
        listTeamTournament.push(teamTournaments[i]);
      }

      if (!listTeamID.includes(teamTournaments[i].team.idTeam)) {
        listTeamID.push(teamTournaments[i].team.idTeam);
        listTeamTournament.push(teamTournaments[i]);
      }
    }
    return listTeamTournament;
  }

  async updateTablePosition(teamTournaments: TeamTournamentEntity[]) {
    for (let index = 0; index < teamTournaments.length; index++) {
      const statsTable = await this._statsTableRepository.findOne(
        teamTournaments[index].stats_table.idStatsTable,
      );
      statsTable.position = index + 1;
      await this._statsTableRepository.save(statsTable);
    }
  }

  async getTournamentsByTeam(idTeam: number) {
    const team = await this._teamRepository.findOne(idTeam);
    if (team) {
      //********************************* */
      //**Como devolver solamente el torneo */
      //********************************* */
      const tournaments = await this._teamTournamentRepository
        .createQueryBuilder('team_tournament')
        .leftJoinAndSelect('team_tournament.team', 'team')
        .leftJoinAndSelect('team_tournament.team_stats', 'team_stats')
        .leftJoinAndSelect('team_tournament.stats_table', 'stats_table')
        .leftJoinAndSelect('team_tournament.tournament', 'tournament')
        .where('team_tournament.team.idTeam = :idTeam', { idTeam: idTeam })
        .getMany();
      return tournaments;
    } else throw new NotFoundException();
  }

  async getTeamsByTournament(idTournament: number) {
    const tournament = await this._tournamentRepository.findOne(idTournament);
    if (tournament) {
      const teams = await this._teamTournamentRepository
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
    } else throw new NotFoundException();
  }

  async getTeamTournamentByPlayerAndTournament(
    idTournament: number,
    idPlayer: number,
  ) {
    const player = await this._playerRepository.findOne(idPlayer);
    const tournament = await this._tournamentRepository.findOne(idTournament);
    if (tournament && player) {
      const teamTournament = await this._teamTournamentRepository
        .createQueryBuilder('team_tournament')
        .leftJoinAndSelect('team_tournament.team', 'team')
        .leftJoinAndSelect('team_tournament.team_stats', 'team_stats')
        .leftJoinAndSelect('team_tournament.stats_table', 'stats_table')
        .leftJoinAndSelect('team_tournament.tournament', 'tournament')
        .where('team_tournament.tournament.idTournament = :idTournament', {
          idTournament: idTournament,
        })
        .andWhere('team_tournament.player.idPlayer = :idPlayer', {
          idPlayer: idPlayer,
        })
        .getOne();
      return teamTournament;
    } else throw new NotFoundException();
  }

  async getTeamTournamentByTeamAndTournament(
    idTeam: number,
    idTournament: number,
  ) {
    return await this._teamTournamentRepository.getTeamTournamentByTeamAndTournament(
      idTeam,
      idTournament,
      this._teamRepository,
      this._tournamentRepository,
      this._teamTournamentRepository,
    );
  }
}
