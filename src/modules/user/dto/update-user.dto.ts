import {
    IsString,
    MinLength,
    MaxLength,
    IsEmail,
  } from 'class-validator';

export class UpdateUserDto {

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  readonly username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  /*@Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })*/
  readonly password: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  readonly image: string;

  
}
