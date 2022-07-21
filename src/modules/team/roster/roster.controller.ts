import { Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';

import { RosterService } from './roster.service';

@Controller('roster')
export class RosterController {
  constructor(private readonly _rosterService: RosterService) { }

  @Get('/history-players/team/:idTeam/')
  async getRosterHistoryByTeam(@Param('idTeam', ParseIntPipe) idTeam: number) {
    return await this._rosterService.getRosterActiveByTeam(idTeam);
  }

  @Get('/active-players/team/:idTeam/')
  async getRosterActiveByTeam(@Param('idTeam', ParseIntPipe) idTeam: number) {
    return await this._rosterService.getRosterActiveByTeam(idTeam);
  }

  @Get('/player/:idPlayer/')
  async getTeamsByPlayer(@Param('idPlayer', ParseIntPipe) idTeam: number) {
    return await this._rosterService.getRosterByPlayer(idTeam);
  }

  @Get('/team/:idTeam/tournament/:idTournament')
  async getRosterByTeamAndTournament(
    @Param('idTeam', ParseIntPipe) idTeam: number,
    @Param('idTournament', ParseIntPipe) idTournament: number) {
    return await this._rosterService.getRosterByTeamAndTournament(idTeam, idTournament);
  }
  @Get('/player/:idPlayer/tournament/:idTournament')
  async getRosterByPlayerAndTournament(
    @Param('idPlayer', ParseIntPipe) idPlayer: number,
    @Param('idTournament', ParseIntPipe) idTournament: number) {
    return await this._rosterService.getRosterByPlayerAndTournament(idPlayer, idTournament);
  }

  @Post('/tournament/:idTournament/team/:idTeam/add-player/:idPlayer')
  async addOnePlayerToRoster(
    @Param('idPlayer', ParseIntPipe) idPlayer: number,
    @Param('idTeam', ParseIntPipe) idTeam: number,
    @Param('idTournament', ParseIntPipe) idTournament: number,
  ) {
    return await this._rosterService.addOnePlayerToRoster(
      idPlayer,
      idTeam,
      idTournament,
    );
  }

  @Delete(':idTournament/team/:idTeam/remove_player/:idPlayer')
  async removeOnePlayerOfRoster(
    @Param('idPlayer', ParseIntPipe) idPlayer: number,
    @Param('idTeam', ParseIntPipe) idTeam: number,
    @Param('idTournament', ParseIntPipe) idTournament: number,
  ) {
    return await this._rosterService.removeOnePlayerOfRoster(
      idPlayer,
      idTeam,
      idTournament,
    );
  }
}
