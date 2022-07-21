import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';

import { TeamTournamentService } from './team_tournament.service';

@Controller('team_tournament')
export class TeamTournamentController {
  constructor(private readonly _teamTournamentService: TeamTournamentService) { }

  @Get('/team/:idTeam')
  async getTournamentsByTeam(@Param('idTeam', ParseIntPipe) idTeam: number) {
    return await this._teamTournamentService.getTournamentsByTeam(idTeam);
  }


  @Get(':idTournament/table')
  async getTableofTournament(@Param('idTournament', ParseIntPipe) idTournament: number) {
    return await this._teamTournamentService.getTableOfTournament(idTournament);
  }

  @Get('/tournament/:idTournament')
  async getTeamsByTournament(@Param('idTournament', ParseIntPipe) idTournament: number) {
    return await this._teamTournamentService.getTeamsByTournament(idTournament);
  }

}
