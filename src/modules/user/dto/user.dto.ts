import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class UserDto {

    @Expose()
    username: string;

    password: string;

    salt: string;

    email: string;

    image: string;
}
