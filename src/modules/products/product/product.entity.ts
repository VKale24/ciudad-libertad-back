import { CartProductEntity } from 'src/modules/carts/cart_product/cartProduct.entity';
import { CommentEntity } from 'src/modules/comments/comments.entity';
import { CompanyEntity } from 'src/modules/company/company.entity';
import { FavoriteEntity } from 'src/modules/favorites/favorite.entity';
import {
  Entity,
  Column,
  Unique,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { ProductSaleEntity } from '../../sales/product_sale/productSale.entity';
import { CategoryProductEntity } from '../categoryProducts/categoryProduct.entity';
import { StateProductEntity } from '../stateProduct/stateProduct.entity';

@Entity({ name: 'product' })
export class ProductEntity {
  @PrimaryGeneratedColumn()
  idProduct: number;

  @Column({ unique: true, nullable: false })
  name: string;

  @Column({ nullable: false })
  price: number;

  @Column({ nullable: false })
  images: string;

  @Column({ default: 0 })
  offert: number;

  @Column()
  description: string;

  @Column({ nullable: false })
  quantity: number;

  @Column({ default: 0 })
  calification: number;

  @CreateDateColumn()
  created_at: Date

  @OneToMany((type) => ProductSaleEntity, (productSale) => productSale.product)
  productSale: ProductSaleEntity[];

  @OneToMany((type) => FavoriteEntity, (favorites) => favorites.idFavorite)
  favorites: FavoriteEntity[];

  @OneToMany((type) => CommentEntity, (comments) => comments.idComment)
  comments: CommentEntity[];

  @OneToMany((type) => CartProductEntity, (cartProduct) => cartProduct.product)
  cartProduct: CartProductEntity[];

  @ManyToOne(
    (type) => CategoryProductEntity,
    (categoryProduct) => categoryProduct.idCategoryProduct,
    {
      eager: false,
      onDelete: 'RESTRICT',
    },
  )
  categoryProduct: CategoryProductEntity;

  @ManyToOne(
    (type) => StateProductEntity,
    (stateProduct) => stateProduct.idStateProduct,
    {
      eager: false,
      onDelete: 'RESTRICT',
    },
  )
  stateProduct: StateProductEntity;

  @ManyToOne((type) => CompanyEntity, (company) => company.idCompany, {
    eager: false,
    onDelete: 'RESTRICT',
  })
  company: CompanyEntity;

  constructor(
    name: string,
    price: number,
    images: string,
    offert: number,
    description: string,
    quantity: number,
    calification: number,
  ) {
    this.name = name;
    this.price = price;
    this.images = images;
    this.offert = offert;
    this.description = description;
    this.quantity = quantity;
    this.calification = calification;
    this.created_at = new Date();
  }
}
