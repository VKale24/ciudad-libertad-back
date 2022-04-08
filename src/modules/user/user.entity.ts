import {
  Entity,
  Column,
  Unique,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Entity({ name: 'user' })
@Unique(['username'])
export class UserEntity {
  @PrimaryGeneratedColumn()
  idUser: number;

  @Column({ unique: true, nullable: false })
  username: string;

  @Column({ nullable: false })
  password: string;

  @Column()
  salt: string;

  constructor(
    username: string,
    password: string,
    salt: string,
  ) {
    this.username = username;
    this.password = password;
    this.salt = salt;
  }

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
