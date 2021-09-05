import { Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { UserEntity } from '../../user/user.entity';
import { CartProductEntity } from '../cart_product/cartProduct.entity';

@Entity({ name: 'cart' })
export class CartEntity {
  @PrimaryGeneratedColumn()
  idCart: number;

  @ManyToOne((type) => UserEntity, (user) => user.idUser, {
    eager: false,
  })
  user: UserEntity;

  @OneToMany(
    (type) => CartProductEntity,
    (cartProduct) => cartProduct.idCartProduct,
  )
  cartProduct: CartProductEntity[];

  constructor(user: UserEntity) {
    this.user = user;
  }
}
