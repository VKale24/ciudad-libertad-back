import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';

import { MatchDto } from './dto/match.dto';
import { MatchService } from './match.service';

@Controller('match')
export class MatchController {
  constructor(private readonly _matchService: MatchService) {}

  @Get()
  async getAllMatchs() {
    return await this._matchService.getAllMatchs();
  }

  @Get('/:idMatch')
  async getMatchById(@Param('idMatch', ParseIntPipe) idMatch: number) {
    return await this._matchService.getMatchById(idMatch);
  }

  // TODO: CHECK getMatchByRound

  /*@Get('round/:round')
  async getMatchByRound(@Param('round') round: number) {
    return await this._matchService.getMatchByRound(round);
  }*/

  @Post()
  async createMatch(
    @Body() matchDto: MatchDto,
    @Body('idTeam1', ParseIntPipe) idTeam1: number,
    @Body('idTeam2', ParseIntPipe) idTeam2: number,
    @Body('idTournament', ParseIntPipe) idTournament: number,
  ) {
    return await this._matchService.createMatch(
      matchDto,
      idTeam1,
      idTeam2,
      idTournament,
    );
  }

  @Patch("/:idMatch")
  async updateMatch(
    @Param("idMatch", ParseIntPipe) idMatch: number,
    @Body()matchDto: MatchDto
  ){
    return await this._matchService.updateMatch(idMatch, matchDto);
  }

  @Delete(":idMatch/close-match")
  async closeMatch(
    @Param("idMatch", ParseIntPipe) idMatch: number
  ){
    return await this._matchService.closeMatch(idMatch);
  }

  @Delete("/:idMatch")
  async deleteMatch(
    @Param("idMatch", ParseIntPipe) idMatch: number
  ){
    return await this._matchService.deleteMatch(idMatch);
  }
}
