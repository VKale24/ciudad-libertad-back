import {
    Entity,
    Column,
    Unique,
    PrimaryGeneratedColumn,
    OneToMany,
  } from 'typeorm';
  import { ProductEntity } from '../product/product.entity';
  
  @Entity({ name: 'stateProduct' })
  @Unique(['name'])
  export class StateProductEntity {
    @PrimaryGeneratedColumn()
    idStateProduct: number;
  
    @Column({ unique: true, nullable: false })
    name: string;
  
    @OneToMany(
      (type) => ProductEntity,
      (product) => product.idProduct,
    )
    product: ProductEntity[];
  
    constructor(name: string) {
      this.name = name;
    }
  }
  