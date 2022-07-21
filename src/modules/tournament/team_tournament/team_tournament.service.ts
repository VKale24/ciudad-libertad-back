import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { TeamTournamentEntity } from './team_tournament.entity';
import { TeamRepository } from 'src/modules/team/team/team.repository';
import { TeamTournamentRepository } from './team_tournament.repository';
import { TournamentRepository } from '../tournament/tournament.repository';
import { StatsTableRepository } from 'src/modules/stats_table/stats_table.repository';
import { PlayerRepository } from 'src/modules/player/repositories/player.repository';

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
    return await this._teamTournamentRepository.getTableOfTournament(idTournament, this._statsTableRepository);
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

  async getTournamentsByTeam(idTeam: number) {
    return await this._teamTournamentRepository.getTournamentsByTeam(idTeam, this._teamRepository);
  }

  async getTeamsByTournament(idTournament: number) {
    return await this._teamTournamentRepository.getTeamsByTournament(idTournament, this._tournamentRepository);
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
