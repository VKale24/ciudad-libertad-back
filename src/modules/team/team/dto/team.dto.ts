import { IsString } from "class-validator";

export class TeamDto {

    @IsString()
    name: string;

    @IsString()
    captain: string; 

    @IsString()
    manager: string; 

    @IsString()
    equipation_color: string;

    @IsString()
    image: string;

    @IsString()
    header_image: string

    @IsString()
    description: string;

    @IsString()
    town: string;

}
