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
  UseInterceptors,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';

import { TournamentDto } from './dto/tournament.dto';
import { TournamentService } from './tournament.service';
import { editFileName, imageFileFilter } from 'src/utils/file.upload';

@Controller('tournament')
export class TournamentController {
  constructor(private readonly _tournamentService: TournamentService) { }

  @Get('/all')
  async getAllTournaments() {
    return await this._tournamentService.getAllTournaments();
  }

  @Get()
  async getTournamentsNotFinalized() {
    return await this._tournamentService.getTournamentsNotFinalized();
  }

  @Get('/:idTournament')
  async getTournamentById(@Param('idTournament', ParseIntPipe) idTournament: number) {
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
    @Param('idTeam', ParseIntPipe) idTeam: number,
    @Param('idTournament', ParseIntPipe) idTournament: number,
  ) {
    return await this._tournamentService.addTeamToTournament(
      idTeam,
      idTournament,
    );
  }

  @Patch('/:idTournament')
  async updateTournament(
    @Param('idTournament', ParseIntPipe) idTournament: number,
    @Body() tournamentDto: TournamentDto,
  ) {
    return await this._tournamentService.updateTournament(
      idTournament,
      tournamentDto,
    );
  }

  @Delete('/:idTournament')
  async finishTournament(@Param('idTournament', ParseIntPipe) idTournament: number) {
    return this._tournamentService.finishTournament(idTournament);
  }
}
