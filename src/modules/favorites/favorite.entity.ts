import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProductEntity } from '../products/product/product.entity';
import { UserEntity } from '../user/user.entity';

@Entity({ name: 'favorites' })
export class FavoriteEntity {
  @PrimaryGeneratedColumn()
  idFavorite: number;

  @ManyToOne((type) => UserEntity, (user) => user.idUser, {
    eager: false,
  })
  user: UserEntity;

  @ManyToOne((type) => ProductEntity, (product) => product.idProduct, {
    eager: false,
  })
  product: ProductEntity;

  constructor(user: UserEntity, product: ProductEntity) {
    this.user = user;
    this.product = product;
  }
}
