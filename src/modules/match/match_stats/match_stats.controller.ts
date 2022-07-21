import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { MatchStatsDto } from './dto/match_stats.dto';
import { MatchStatsService } from './match_stats.service';

@Controller('match_stats')
export class MatchStatsController {
  constructor(private readonly _matchStatsService: MatchStatsService) {}

  @Get('/match/:idMatch')
  async getStatsByMatch(@Param('idMatch', ParseIntPipe) idMatch: number) {
    return await this._matchStatsService.getStatsByMatch(idMatch);
  }

  @Get('/match/:idMatch/team/:idTeam')
  async getStatsByMatchAndTeam(
    @Param('idMatch', ParseIntPipe) idMatch: number,
    @Param('idTeam', ParseIntPipe) idTeam: number,
  ) {
    return await this._matchStatsService.getStatsByMatchAndTeam(
      idMatch,
      idTeam,
    );
  }

  @Get('/:idMatchStats/goals')
  async getGoalsByMatchStats(
    @Param('idMatchStats', ParseIntPipe) idMatchStats: number,
  ) {
    return await this._matchStatsService.getGoalsByMatchStats(idMatchStats);
  }

  @Post('/match/:idMatch/team/:idTeam')
  async createStatsOfMatch(
    @Param('idMatch', ParseIntPipe) idMatch: number,
    @Param('idTeam', ParseIntPipe) idTeam: number,
  ) {
    return await this._matchStatsService.createStatsOfMatch(
      idMatch,
      idTeam,
    );
  }

  @Post(':idMatchStats/goal/:idPlayer')
  async addGoal(
    @Param('idMatchStats') idMatchStats: number,
    @Param('idPlayer', ParseIntPipe) idPlayer: number,
    @Body('minute', ParseIntPipe) minute: number,
  ) {
    return await this._matchStatsService.addGoal(
      idMatchStats,
      idPlayer,
      minute,
    );
  }
  @Post(':idMatchStats/assist/:idPlayer')
  async addAssist(
    @Param('idMatchStats') idMatchStats: number,
    @Param('idPlayer', ParseIntPipe) idPlayer: number,
    @Body('minute', ParseIntPipe) minute: number,
  ) {
    return await this._matchStatsService.addAssist(
      idMatchStats,
      idPlayer,
      minute,
    );
  }

  @Post(':idMatchStats/yellow_card/:idPlayer')
  async addYellowCard(
    @Param('idMatchStats', ParseIntPipe) idMatchStats: number,
    @Param('idPlayer', ParseIntPipe) idPlayer: number,
    @Body('minute', ParseIntPipe) minute: number,
  ) {
    return await this._matchStatsService.addYellowCard(
      idMatchStats,
      idPlayer,
      minute,
    );
  }

  @Post(':idMatchStats/red_card/:idPlayer')
  async addRedCard(
    @Param('idMatchStats',ParseIntPipe) idMatchStats: number,
    @Param('idPlayer', ParseIntPipe) idPlayer: number,
    @Body('minute', ParseIntPipe) minute: number,
  ) {
    return await this._matchStatsService.addRedCard(
      idMatchStats,
      idPlayer,
      minute,
    );
  }
}
