import {
  Entity,
  Column,
  Unique,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { ProductEntity } from '../products/product/product.entity';

@Entity({ name: 'company' })
@Unique(['name'])
export class CompanyEntity {
  @PrimaryGeneratedColumn()
  idCompany: number;

  @Column({ unique: true, nullable: false })
  name: string;

  @OneToMany((type) => ProductEntity, (product) => product.idProduct)
  products: ProductEntity[];

  constructor(name: string) {
    this.name = name;
  }
}
