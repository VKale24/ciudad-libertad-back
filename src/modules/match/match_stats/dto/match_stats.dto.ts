import { IsNumber } from "class-validator";

export class MatchStatsDto {
  
    @IsNumber()
    yellow_card: number;

    @IsNumber()
    red_card: number;

    @IsNumber()
    goals: number;

    @IsNumber()
    assists: number;
}
