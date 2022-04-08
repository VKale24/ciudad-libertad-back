import { Controller, Get, Param } from "@nestjs/common";
import { TeamMatchService } from "./team_match.service";

@Controller("team_match")
export class TeamMatchController{

    constructor(private readonly _teamMatchService: TeamMatchService){}

    @Get("/team/:idTeam")
    async getMatchsByTeam(
        @Param("idTeam")idTeam: number
    ){
        return await this._teamMatchService.getMatchsByTeam(idTeam);
    }

    @Get("/match/:idMatch")
    async getTeamsByMatch(
        @Param("idMatch")idMatch: number
    ){
        return await this._teamMatchService.getTeamsByMatch(idMatch);
    }
}