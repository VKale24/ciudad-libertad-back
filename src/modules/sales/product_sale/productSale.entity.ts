import { ProductEntity } from 'src/modules/products/product/product.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { UserEntity } from '../../user/user.entity';
import { SaleEntity } from '../sale/sale.entity';

@Entity({ name: 'productSale' })
export class ProductSaleEntity {
  @PrimaryGeneratedColumn()
  idProductSale: number;

  @Column()
  quantity: number;

  @ManyToOne((type) => ProductEntity, (product) => product.idProduct, {
    eager: false,
  })
  product: ProductEntity;

  @ManyToOne((type) => SaleEntity, (sale) => sale.idSale, {
    eager: false,
  })
  sale: SaleEntity;

  constructor(quantity: number, product: ProductEntity, sale: SaleEntity) {
    this.quantity = quantity;
    this.product = product;
    this.sale = sale;
  }
}
