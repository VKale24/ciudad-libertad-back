import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from 'src/utils/file.upload';
import { PlayerDto } from './dto/player.dto';
import { PlayerService } from './player.service';

@Controller('player')
export class PlayerController {
  constructor(private _playerService: PlayerService) {}

  @Get()
  async getAllPlayers() {
    return await this._playerService.getAllPlayers();
  }

  @Get('/:id')
  async getPlayerById(@Param('id') idPlayer: number) {
    return await this._playerService.getPlayerById(idPlayer);
  }
  @Get('/:idPlayer/historic_stats')
  async getHistoricStatsOfPlayer(@Param('idPlayer') idPlayer: number) {
    return await this._playerService.getHistoricStatsOfPlayer(idPlayer);
  }
  @Get('/:idPlayer/stats_tournament/:idTournament')
  async getStatsOfPlayerByTournament(
    @Param('idPlayer') idPlayer: number,
    @Param('idTournament') idTournament: number,
  ) {
    return await this._playerService.getStatsOfPlayerByTournament(
      idPlayer,
      idTournament,
    );
  }
  @Get('/team/:idTeam/')
  async getAllPlayersByTeam(
    @Param('idTeam') idTeam: number,
  ) {
    return await this._playerService.getAllPlayersByTeam(
      idTeam,
    );
  }
  @Get('/team/:idTeam/tournament/:idTournament')
  async getAllPlayersByTeamTournament(
    @Param('idTeam') idTeam: number,
    @Param('idTournament') idTournament: number,
  ) {
    return await this._playerService.getAllPlayersByTeamTournament(
      idTeam,
      idTournament,
    );
  }
  @Get('/active/team/:idTeam/tournament/:idTournament')
  async getAllActivePlayersByTeamTournament(
    @Param('idTeam') idTeam: number,
    @Param('idTournament') idTournament: number,
  ) {
    return await this._playerService.getAllPlayersActiveByTeamTournament(
      idTeam,
      idTournament,
    );
  }

  @Get('/tournament/:idTournament/rank_scores')
  async getRankScoresByTournament(
    @Param('idTournament', ParseIntPipe) idTournament: number,
  ) {
    return await this._playerService.getRankScoresByTournament(idTournament);
  }

  @Get('/tournament/:idTournament/rank_assist')
  async getRankAssistByTournament(
    @Param('idTournament', ParseIntPipe) idTournament: number,
  ) {
    return await this._playerService.getRankAssistByTournament(idTournament);
  }
  @Get('/tournament/:idTournament/rank_yellow_card')
  async getRankYellowCardByTournament(
    @Param('idTournament', ParseIntPipe) idTournament: number,
  ) {
    return await this._playerService.getRankYellowCardByTournament(
      idTournament,
    );
  }
  @Get('/tournament/:idTournament/rank_red_card')
  async getRankRedCardByTournament(
    @Param('idTournament', ParseIntPipe) idTournament: number,
  ) {
    return await this._playerService.getRankRedCardByTournament(idTournament);
  }
  @Get('/:idPlayer/team_tournament/all/')
  async getAllTeamsTournamentsOfPlayer(
    @Param('idPlayer', ParseIntPipe) idPlayer: number,
  ) {
    return await this._playerService.getAllTeamsTournamentsOfPlayer(idPlayer);
  }

  @Post()
  async createPlayer(@Body() playerDto: PlayerDto) {
    return await this._playerService.createPlayer(playerDto);
  }

  @Post('/:idPlayer/upload-image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './files',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadImageToPlayer(
    @Param('idPlayer') idPlayer: number,
    @UploadedFile() file: any,
  ) {
    return await this._playerService.uploadImageToPlayer(idPlayer, file);
  }

  @Patch('/:id')
  async updatePlayer(
    @Param('id') idPlayer: number,
    @Body() playerDto: PlayerDto,
  ) {
    return await this._playerService.updatePlayer(idPlayer, playerDto);
  }

  @Post('/:id/activate_player')
  async activatePlayer(@Param('id', ParseIntPipe) idPlayer: number) {
    return await this._playerService.activatePlayer(idPlayer);
  }

  @Delete('/:id')
  async deletePlayer(@Param('id', ParseIntPipe) idPlayer: number) {
    return await this._playerService.desactivatePlayer(idPlayer);
  }
}
