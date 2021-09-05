import { ProductEntity } from 'src/modules/products/product/product.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { CartEntity } from '../cart/cart.entity';

@Entity({ name: 'cartProduct' })
export class CartProductEntity {
  @PrimaryGeneratedColumn()
  idCartProduct: number;

  @Column({ nullable: false })
  quantity: number;

  @ManyToOne((type) => CartEntity, (cart) => cart.idCart, {
    eager: false,
  })
  cart: CartEntity;

  @ManyToOne((type) => ProductEntity, (product) => product.idProduct, {
    eager: false,onDelete: "CASCADE"
  },)
  product: ProductEntity;

  constructor(cart: CartEntity, product: ProductEntity, quantity: number) {
    this.cart = cart;
    this.product = product;
    this.quantity = quantity;
  }
}
