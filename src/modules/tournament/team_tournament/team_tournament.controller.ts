import { Controller, Get, Param } from "@nestjs/common";

import { TeamTournamentService } from "./team_tournament.service";

@Controller("team_tournament")
export class TeamTournamentController{

    constructor(private readonly _teamTournamentService: TeamTournamentService){}
    
    @Get("/team/:idTeam")
    async getTournamentsByTeam(
        @Param("idTeam")idTeam: number
        ){
            return await this._teamTournamentService.getTournamentsByTeam(idTeam);
        }
        
    @Get(":idTournament/table")
    async getTableofTournament(
        @Param("idTournament")idTournament: number
        ){
            return await this._teamTournamentService.getTableOfTournament(idTournament);
        }

    @Get("/tournament/:idTournament")
    async getTeamsByTournament(
        @Param("idTournament")idTournament: number
    ){
        return await this._teamTournamentService.getTeamsByTournament(idTournament);
    }

     @Get("/tournament/:idTournament/player/:idPlayer")
    async getTeamTournamentByPlayerAndTournament(
        @Param("idPlayer") idPlayer: number,
        @Param("idTournament")idTournament: number,
    ){
        return await this._teamTournamentService.getTeamTournamentByPlayerAndTournament(idTournament, idPlayer);
    }

}