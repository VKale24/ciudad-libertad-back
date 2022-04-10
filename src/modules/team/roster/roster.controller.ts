import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { RosterService } from './roster.service';

@Controller('roster')
export class RosterController {
  constructor(private readonly _rosterService: RosterService) {}

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
    return await this._rosterService.getTeamsByPlayer(idTeam);
  }

  @Post('/tournament/:idTournament/team/:idTeam/add-player/:idPlayer')
  async addOnePlayerToRoster(
    @Param('idPlayer') idPlayer: number,
    @Param('idTeam') idTeam: number,
    @Param('idTournament') idTournament: number,
  ) {
    return await this._rosterService.addOnePlayerToRoster(
      idPlayer,
      idTeam,
      idTournament,
    );
  }
}
