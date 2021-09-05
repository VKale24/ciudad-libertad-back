import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { UserEntity } from '../../user/user.entity';
import { ProductSaleEntity } from '../product_sale/productSale.entity';

@Entity({ name: 'sale' })
export class SaleEntity {
  @PrimaryGeneratedColumn()
  idSale: number;

  @Column({ nullable: false })
  adress: string;

  @Column({ nullable: false })
  payment: number;

  @ManyToOne((type) => UserEntity, (user) => user.idUser, {
    eager: false,
    onDelete: 'RESTRICT',
  })
  user: UserEntity;

  @OneToMany((type) => ProductSaleEntity, (productSale) => productSale.sale)
  productSale: ProductSaleEntity[];

  constructor(adress: string, payment: number) {
    this.adress = adress;
    this.payment = payment;
  }
}
