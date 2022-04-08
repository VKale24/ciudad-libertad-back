import { IsNumber, IsString } from "class-validator";

export class TournamentDto {

    @IsString()
    name: string;

    @IsNumber()
    duration: number;

    @IsString()
    quantityTeams: number; 

    @IsString()
    image: string;
}
