import { Controller, Get, Param } from "@nestjs/common";
import { TournamentMatchService } from "./tournament_match.service";

@Controller("tournament_match")
export class TournamentMatchController{

    constructor(private readonly _tournamentMatchService: TournamentMatchService){}

    @Get("/match/:idMatch")
    async getTournamentByMatch(
        @Param("idMatch")idMatch: number
    ){
        return await this._tournamentMatchService.getTournamentByMatch(idMatch);
    }

    @Get("/tournament/:idTournament")
    async getMatchsByTournament(
        @Param("idTournament")idTournament: number
    ){
        return await this._tournamentMatchService.getMatchsByTournament(idTournament);
    }

    @Get("/tournament/:idTournament/round/:round")
    async getMatchsOfTournamentByRound(
        @Param("idTournament")idTournament: number,
        @Param("round")round: number,
    ){
        return await this._tournamentMatchService.getMatchsOfTournamentByRound(idTournament, round);
    }
    
}