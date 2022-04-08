import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { editFileName, imageFileFilter } from "src/utils/file.upload";
import { TeamDto } from "./dto/team.dto";
import { TeamService } from "./team.service";

@Controller("team")
export class TeamController{

    constructor(private readonly _teamService: TeamService){}

    @Get()
    async getAllTeams(){
        return await this._teamService.getAllTeams();
    }

    @Get('/:id')
    async getTeamById(
        @Param('id') idTeam: number
    ){
        return await this._teamService.getTeamById(idTeam);
    }

    @Post()
    async createTeam(
        @Body() teamDto: TeamDto
    ){
        return await this._teamService.createTeam(teamDto);
    }

    @Patch("/:id")
    async updateTeam(
        @Param("id")idTeam: number,
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
    @Param('idTeam') idTeam: number,
    @UploadedFile() file: any,
  ) {
    console.log("Entro");
    return await this._teamService.uploadImageToTeam(idTeam, file);
  }

    @Delete("/:id")
    async deleteTeam(
        @Param("id")idTeam: number
    ){
        return await this._teamService.deleteTeam(idTeam);
    }
}