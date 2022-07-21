import { diskStorage } from "multer";
import { FileInterceptor } from "@nestjs/platform-express";
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UploadedFile, UseInterceptors } from "@nestjs/common";

import { TeamDto } from "./dto/team.dto";
import { TeamService } from "./team.service";
import { editFileName, imageFileFilter } from "src/utils/file.upload";

@Controller("team")
export class TeamController{

    constructor(private readonly _teamService: TeamService){}

    @Get()
    async getAllTeams(){
        return await this._teamService.getAllTeams();
    }

    @Get('/:idTeam')
    async getTeamById(
        @Param('idTeam', ParseIntPipe) idTeam: number
    ){
        return await this._teamService.getTeamById(idTeam);
    }

    @Post()
    async createTeam(
        @Body() teamDto: TeamDto
    ){
        return await this._teamService.createTeam(teamDto);
    }

    @Patch("/:idTeam")
    async updateTeam(
        @Param("idTeam", ParseIntPipe) idTeam: number,
        @Body()teamDto: TeamDto
    ){
        return await this._teamService.updateTeam(idTeam,teamDto);
    }

    @Post('/:idTeam/upload-image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './files',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadImageToTeam(
    @Param('idTeam', ParseIntPipe) idTeam: number,
    @UploadedFile() file: any,
  ) {
    return await this._teamService.uploadImageToTeam(idTeam, file);
  }

    @Delete("/:idTeam")
    async desactivateTeam(
        @Param("idTeam", ParseIntPipe)idTeam: number
    ){
        return await this._teamService.desactivateTeam(idTeam);
    }
}