import { IsDate, IsNumber, IsString } from "class-validator";

export class MatchDto {
  
    @IsString()
    referee: string;
 
    @IsString()
    date: string

    @IsNumber()
    round: number;
}
