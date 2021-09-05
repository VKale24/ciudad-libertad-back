import {
  Entity,
  Column,
  Unique,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { SaleEntity } from '../sales/sale/sale.entity';
import { UserRoleEntity } from '../roles/user_role/userRole.entity';
import { FavoriteEntity } from '../favorites/favorite.entity';
import { CommentEntity } from '../comments/comments.entity';

@Entity({ name: 'user' })
@Unique(['username'])
@Unique(['email'])
export class UserEntity {
  @PrimaryGeneratedColumn()
  idUser: number;

  @Column({ unique: true, nullable: false })
  username: string;

  @Column({ nullable: false })
  password: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column()
  salt: string;

  @Column({ nullable: true, default: 'no image' })
  image: string;

  @Column({ nullable: true, default: 'no phone' })
  phone: string;

  @Column({ nullable: true, default: 'no adress' })
  adress: string;

  @OneToMany((type) => SaleEntity, (sale) => sale.idSale, { cascade: true })
  sale: SaleEntity[];

  @OneToMany((type) => FavoriteEntity, (favorites) => favorites.idFavorite, {
    cascade: true,
  })
  favorites: FavoriteEntity[];

  @OneToMany((type) => CommentEntity, (comments) => comments.idComment, {
    cascade: true,
  })
  comments: CommentEntity[];
  
  @OneToMany((type) => UserRoleEntity, (userRole) => userRole.user, {
    cascade: true,
  })
  userRole: UserRoleEntity[];

  constructor(
    username: string,
    password: string,
    email: string,
    salt: string,
    adress: string,
    phone: string,
    image: string,
  ) {
    this.username = username;
    this.password = password;
    this.email = email;
    this.salt = salt;
    this.adress = adress;
    this.phone = phone;
    this.image = image;
  }

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
