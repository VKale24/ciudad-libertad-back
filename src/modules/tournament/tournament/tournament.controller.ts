import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from 'src/utils/file.upload';
import { TournamentDto } from './dto/tournament.dto';
import { TournamentService } from './tournament.service';

@Controller('tournament')
export class TournamentController {
  constructor(private readonly _tournamentService: TournamentService) {}

  @Get('/all')
  async getAllTournaments() {
    return await this._tournamentService.getAllTournaments();
  }

  @Get()
  async getTournamentsNotFinalized() {
    return await this._tournamentService.getTournamentsNotFinalized();
  }

  @Get('/:idTournament')
  async getTournamentById(@Param('idTournament') idTournament: number) {
    return await this._tournamentService.getTournamentById(idTournament);
  }

  @Post()
  async createTournament(@Body() tournamentDto: TournamentDto) {
    return await this._tournamentService.createTournament(tournamentDto);
  }

  

  @Post('/:idTournament/upload-image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './files/',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadImageToTournament(
    @Param('idTournament') idTournament: number,
    @UploadedFile() file: any,
  ): Promise<any> {
    return await this._tournamentService.uploadImageToTournament(idTournament, file);
  }

  @Post(':idTournament/add_team/:idTeam')
  async addTeamToTournament(
    @Param('idTeam') idTeam: number,
    @Param('idTournament') idTournament: number,
  ) {
    return await this._tournamentService.addTeamToTournament(
      idTeam,
      idTournament,
    );
  }

  @Patch('/:idTournament')
  async updateTournament(
    @Param('idTournament') idTournament: number,
    @Body() tournamentDto: TournamentDto,
  ) {
    return await this._tournamentService.updateTournament(
      idTournament,
      tournamentDto,
    );
  }

  @Delete(':idTournament/team/:idTeam/remove_player/:idPlayer')
  async removeOnePlayerOfRoster(
    @Param('idPlayer') idPlayer: number,
    @Param('idTeam') idTeam: number,
    @Param('idTournament') idTournament: number,
  ) {
    return await this._tournamentService.removeOnePlayerOfRoster(
      idPlayer,
      idTeam,
      idTournament,
    );
  }

  @Delete('/:idTournament')
  async deleteTournament(@Param('idTournament') idTournament: number) {
    return this._tournamentService.deleteTournament(idTournament);
  }
}
