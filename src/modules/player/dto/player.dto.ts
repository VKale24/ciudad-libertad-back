import { IsBoolean, IsNumber, IsString } from "class-validator";

export class PlayerDto {
    @IsString()
    name: string;
 
    @IsString()
    last_name: string;
 
    @IsString()
    nickname: string;
 
    @IsNumber()  
    age: number;
 
    @IsString()
    ci: string;
 
    @IsString()
    height: number;
 
    @IsString()
    weight: number;
 
    @IsString()
    phone: number;
 
    @IsString()
    email: string;
 
    @IsString()
    profession: string;
 
    @IsString()
    image: string;

    @IsString()
    image_face: string;
 
    @IsString()
    position: string;

    @IsBoolean()
    active: boolean;
}
