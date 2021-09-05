import { IsString, MinLength, MaxLength, IsEmail, IsPhoneNumber } from 'class-validator';

export class RegisterCredentials {
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

  @IsPhoneNumber()
  readonly phone: string;
  
    @IsString()
    readonly adress: string;

  @IsString()
  readonly image: string;
}
